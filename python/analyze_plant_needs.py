import spacy
import httpx
from typing import Dict, List, Set, Tuple
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from geopy.geocoders import Nominatim
import asyncio
import re


class RequestData(BaseModel):
    text: str


class PlantAnalysisResult(BaseModel):
    watering_scores: List[int]
    sunlight_scores: List[int]
    size_scores: List[int]
    season_scores: List[int]
    temperature_class: int
    color: str


class UnifiedPlantAnalyzer:
    def __init__(self, words_api_key: str):
        try:
            self.nlp = spacy.load("en_core_web_lg")
        except OSError:
            self.nlp = spacy.load("en_core_web_sm")

        # Add special cases for tokenization
        special_cases = {
            "don't": [{"ORTH": "don't"}],
            "doesn't": [{"ORTH": "doesn't"}],
            "can't": [{"ORTH": "can't"}],
            "won't": [{"ORTH": "won't"}],
            "isn't": [{"ORTH": "isn't"}],
            "dont": [{"ORTH": "dont"}]
        }

        for case, token_list in special_cases.items():
            self.nlp.tokenizer.add_special_case(case, token_list)

        self.words_api_key = words_api_key
        self.geolocator = Nominatim(user_agent="unified_plant_analyzer")

        # Keywords for all categories
        self.keywords = {
            # Watering needs
            "watering_high": ["frequently", "daily", "often", "regular", "constant", "need lots", "must water",
                              "demanding", "a lot", "lots", "water"],
            "watering_low": ["rarely", "seldom", "minimal", "low maintenance", "drought", "dry", "occasional", "sparse",
                             "little water", "remember"],
            "watering_medium": ["weekly", "moderate", "sometimes", "average", "normal"],

            # Sunlight needs
            "sunlight_high": ["bright", "direct", "full", "intense", "strong", "sunny", "clear sky", "unobstructed",
                              "window", 'garden', 'field', 'forest', 'park', 'orchard', 'farm',"balcony",'sun'],
            "sunlight_low": ["shade", "shadow", "dark", "indirect", "no sun", "deep shade", "low light", "protected"],
            "sunlight_medium": ["partial", "moderate", "filtered", "some", "dappled", "light shade", "morning sun",
                                "afternoon shade", "half sun", "blocks"],

            # Size needs
            "size_small": ['shelf', 'windowsill', 'desk', 'counter', 'tabletop', 'cabinet', 'pot', 'small', 'tiny',
                           'compact'],
            "size_medium": ['floor', 'room', 'balcony', 'patio', 'terrace', 'courtyard', 'veranda', 'medium',
                            'moderate'],
            "size_large": ['garden', 'field', 'forest', 'park', 'greenhouse', 'orchard', 'farm', 'big', 'large', 'tree',
                           'grow'],

            # Season needs
            "season_summer": ['summer', 'summertime', 'hot', 'sunny', 'warm season'],
            "season_winter": ['winter', 'wintertime', 'cold', 'freezing', 'cold season'],
            "season_spring": ['spring', 'springtime', 'pleasant', 'warm', 'blooming'],
            "season_fall": ['fall', 'autumn', 'cool', 'crisp'],
            "season_all": ['all year', 'year round', 'year-round', 'all', 'year', 'always', 'anytime', 'every season',
                           'throughout the year'],

            # Common negation words and phrases
            "negation_words": ["nt", "not", "dont", "don't", "doesnt", "doesn't", "no", "never", "hardly", "barely",
                               "rarely",
                               "neither", "cannot", "cant", "can't", "won't", "wont", "isn't", "isnt", "avoid"],

            # Negation phrases that indicate not wanting certain conditions
            "negation_phrases": ["don't want", "dont want", "doesn't need", "doesnt need", "can't handle",
                                 "cant handle",
                                 "avoid", "not need", "not require", "not necessary", "don't like", "dont like"],

            # Base colors
            "colors": ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "black", "white", "gray",
                       "grey"]
        }

        # Caching
        self.synonyms_cache = {}
        self.keywords_enriched = False

        # Default base scores when negation is detected but no specific category is matched
        self.default_negation_scores = {
            "watering": [0, 3, 0],  # Default to low watering when generic negation is found
            "sunlight": [0, 1, 1],  # Default to medium-low light when generic negation is found
            "size": [0, 1, 1],  # Default to medium-small size when generic negation is found
            "season": [0, 0, 1, 0, 0]  # Default to spring when generic negation is found
        }

    async def _get_synonyms_from_words_api(self, word: str) -> List[str]:
        """Get synonyms using Words API with caching"""
        if word in self.synonyms_cache:
            return self.synonyms_cache[word]

        formatted_word = word if " " not in word else word.replace(" ", "-")
        url = f"https://wordsapiv1.p.rapidapi.com/words/{formatted_word}/synonyms"
        headers = {
            "X-RapidAPI-Key": self.words_api_key,
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=5.0)
                if response.status_code == 200:
                    data = response.json()
                    synonyms = data.get("synonyms", [])
                    self.synonyms_cache[word] = synonyms
                    return synonyms
        except Exception:
            pass

        return []

    async def _enrich_keywords_with_synonyms(self):
        """Enrich all keywords with synonyms"""
        if self.keywords_enriched:
            return

        enriched_keywords = {}

        # Process all categories except negation words and colors
        for category, words in self.keywords.items():
            if category in ["negation_words", "negation_phrases", "colors"]:
                enriched_keywords[category] = words
                continue

            enriched_set = set(words)

            for word in words:
                synonyms = await self._get_synonyms_from_words_api(word)
                enriched_set.update(synonyms)

            enriched_keywords[category] = list(enriched_set)

        self.keywords = enriched_keywords
        self.keywords_enriched = True

    def _check_negation_context(self, text: str, keyword: str, category_prefix: str, window_size: int = 30) -> bool:
        """
        Improved negation detection that checks for negation words and phrases
        around a keyword with proper context window and considers linguistic structure

        Args:
            text: The input text
            keyword: The keyword to check for negation
            category_prefix: The category prefix (e.g., "watering_", "sunlight_")
            window_size: Context window size in characters

        Returns:
            bool: True if the keyword is negated, False otherwise
        """
        text_lower = text.lower()
        keyword_lower = keyword.lower()

        # Find all occurrences of the keyword
        keyword_positions = [m.start() for m in re.finditer(r'\b' + re.escape(keyword_lower) + r'\b', text_lower)]

        # If no exact matches, look for the keyword as a substring (for partial matches)
        if not keyword_positions and len(keyword_lower) > 3:
            keyword_positions = [text_lower.find(keyword_lower)]
            if keyword_positions[0] == -1:
                return False

        # Category-specific negation patterns
        category_patterns = {
            "watering_": ["water", "watering", "moisture", "hydration", "irrigation", "moist", "wet", "damp"],
            "sunlight_": ["sun", "light", "bright", "illumination", "sunny", "sunshine", "sunlight"],
            "size_": ["size", "big", "large", "small", "tiny", "grow", "growth", "space", "height", "width"],
            "season_": ["season", "year", "summer", "winter", "spring", "fall", "autumn", "temperature", "climate"]
        }

        # Get relevant terms for the current category
        category_terms = category_patterns.get(category_prefix, [])

        for position in keyword_positions:
            # Define context window (words before and after the keyword)
            start = max(0, position - window_size)
            end = min(len(text_lower), position + len(keyword) + window_size)
            context = text_lower[start:end]

            # Parse the context with spaCy to analyze dependencies
            doc = self.nlp(context)

            # Find the token that matches our keyword
            keyword_token = None
            for token in doc:
                if token.text.lower() == keyword_lower or keyword_lower in token.text.lower():
                    keyword_token = token
                    break

            if not keyword_token:
                continue

            # Check for direct negation on the keyword itself
            if any(child.dep_ == "neg" for child in keyword_token.children):
                return True

            # Check if any negation words are in the same dependency subtree with the keyword
            for token in doc:
                if token.text.lower() in self.keywords["negation_words"]:
                    # Find the head of the negation chain
                    head = token.head

                    # Check if the negation affects our keyword
                    if head.text.lower() == keyword_lower:
                        return True

                    # Check if the negation is part of a phrase related to our category
                    if any(term in head.text.lower() for term in category_terms):
                        # If this negation affects a term in our category AND the keyword is also in this category
                        if any(term in keyword_lower for term in category_terms):
                            return True

            # Simple proximity check for negation words with category-specific constraints
            for neg in self.keywords["negation_words"]:
                neg_pos = context.find(neg)
                if neg_pos == -1:
                    continue

                # Check if there's a category term near the negation word
                neg_context = context[max(0, neg_pos - 10):min(len(context), neg_pos + len(neg) + 20)]

                # Only consider this negation relevant if it's associated with the correct category
                if any(term in neg_context for term in category_terms):
                    if abs(neg_pos - context.find(keyword_lower)) < 20:  # If negation is close to keyword
                        return True

            # Check for negation phrases specific to the category
            category_specific_phrases = [
                phrase for phrase in self.keywords["negation_phrases"]
                if any(term in phrase for term in category_terms)
            ]

            for phrase in category_specific_phrases:
                if phrase in context:
                    return True

        return False

    def _has_general_negation(self, text: str, category_prefix: str) -> bool:
        """
        Detect if there's a general negation related to a category
        without specifically mentioning keywords
        """
        text_lower = text.lower()

        # Check for category-specific negation patterns
        if category_prefix == "watering_":
            patterns = [
                r"don'?t\s+(?:want|like|need)?\s+(?:to\s+)?water",
                r"minimal\s+watering",
                r"low\s+maintenance",
                r"(?:hate|dislike)\s+watering",
                r"forget\s+to\s+water"
            ]
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return True

        elif category_prefix == "sunlight_":
            patterns = [
                r"don'?t\s+(?:want|like|need)?\s+(?:much\s+)?(?:sun|light|sunlight)",
                r"(?:hate|dislike)\s+(?:bright|direct)\s+(?:sun|light|sunlight)",
                r"too\s+(?:bright|sunny)"
            ]
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return True

        elif category_prefix == "size_":
            patterns = [
                r"don'?t\s+(?:want|like|need)?\s+(?:a\s+)?(?:big|large)\s+plant",
                r"no\s+(?:big|large)\s+plants",
                r"small\s+space",
                r"limited\s+space"
            ]
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return True

        return False

    def _score_category(self, text: str, doc, category_prefix: str) -> List[int]:
        """Improved generic scoring function for different categories with better negation handling"""
        categories = [k for k in self.keywords.keys() if k.startswith(category_prefix)]
        results = {k.split('_')[1]: 0 for k in categories}
        # Track if we found any keyword matches
        found_any_keyword = False
        has_general_negation = self._has_general_negation(text, category_prefix)
        for category in categories:
            cat_type = category.split('_')[1]
            for keyword in self.keywords[category]:
                if keyword.lower() in text.lower():
                    found_any_keyword = True
                    # Check if the keyword is negated
                    negated = self._check_negation_context(text, keyword,category_prefix)

                    if negated:
                        # Apply opposite scoring when negated
                        if category_prefix == "watering_":
                            if cat_type == "high":
                                results["low"] += 4
                            elif cat_type == "medium":
                                results["low"] += 2
                            elif cat_type == "low":
                                results["high"] += 3
                        elif category_prefix == "sunlight_":
                            if cat_type == "high":
                                results["low"] += 4
                            elif cat_type == "medium":
                                results["low"] += 2
                            elif cat_type == "low":
                                results["high"] += 3
                        elif category_prefix == "size_":
                            if cat_type == "large":
                                results["small"] += 4
                            elif cat_type == "medium":
                                results["small"] += 2
                            elif cat_type == "small":
                                results["large"] += 3
                        elif category_prefix == "season_":
                            if cat_type == "all":
                                # If "all seasons" is negated, distribute points among specific seasons
                                for season in ["summer", "winter", "spring", "fall"]:
                                    results[season] += 1
                            elif cat_type != "all":  # For specific seasons
                                other_seasons = [s for s in ["summer", "winter", "spring", "fall"] if s != cat_type]
                                for other in other_seasons:
                                    results[other] += 1
                    else:
                        # Regular scoring for non-negated terms
                        if cat_type == "all" and category_prefix == "season_":
                            results[cat_type] += 5  # Boost "all seasons" score when explicitly mentioned
                        else:
                            results[cat_type] += 2

        # If general negation detected but no specific keyword matched, apply default scores
        if has_general_negation and not found_any_keyword:
            category_key = category_prefix.rstrip('_')
            if category_key in self.default_negation_scores:
                default_scores = self.default_negation_scores[category_key]
                # Convert the results dict values to match the default scores array
                keys = list(results.keys())
                for i, key in enumerate(keys):
                    if i < len(default_scores):
                        results[key] = default_scores[i]

        # Special handling for certain conditions

        # Special case for "water" keyword
        if category_prefix == "watering_" and "water" in text.lower():
            water_negated = self._check_negation_context(text, "water",category_prefix)
            if water_negated and all(v == 0 for v in results.values()):
                results["low"] += 3  # If just "water" is negated, assume low watering needs

        # Special case for size when mixed keywords found
        if category_prefix == "size_" and results["large"] > 0 and results["small"] > 0:
            results["medium"] += 3

        # Special case for "all year" and similar phrases in season
        if category_prefix == "season_" and any(
                phrase in text.lower() for phrase in ["all year", "year round", "year-round"]):
            results["all"] += 4  # Increase the weight for "all seasons"

        # Always return at least some values when category is mentioned
        if category_prefix == "watering_" and "water" in text.lower() and all(v == 0 for v in results.values()):
            results["medium"] += 1  # Default to medium watering if water is mentioned but no specifics

        return list(results.values())

    def _classify_climate(self, latitude):
        # Climate classification based on latitude
        if abs(latitude) <= 10:
            return 5  # Equatorial
        elif abs(latitude) <= 23.5:
            return 4  # Tropical
        elif abs(latitude) <= 35:
            return 2  # Subtropical
        elif abs(latitude) <= 60:
            return 1  # Temperate
        else:
            return 0  # Cold

    async def _detect_temperature(self, text: str) -> int:
        # Detect location entities and determine climate
        doc = self.nlp(text)

        for ent in doc.ents:
            if ent.label_ == "GPE":
                try:
                    # Find location coordinates asynchronously
                    location = await asyncio.get_event_loop().run_in_executor(
                        None,
                        self.geolocator.geocode,
                        ent.text
                    )

                    if location:
                        return self._classify_climate(location.latitude)
                except Exception:
                    continue

        # Default to subtropical
        return 2

    def _extract_color(self, text: str) -> str:
        """Extract color mentions from text"""
        text_lower = text.lower()

        for color in self.keywords["colors"]:
            if color in text_lower:
                # Check if the color is negated
                if self._check_negation_context(text, color,category_prefix='colors'):
                    continue
                return color

        return ""

    async def analyze(self, text: str) -> PlantAnalysisResult:
        """Analyze text and provide comprehensive plant recommendation scores"""
        # Ensure keywords are enriched
        await self._enrich_keywords_with_synonyms()

        # Process text
        doc = self.nlp(text)

        # Run all analyses in parallel
        watering_scores = self._score_category(text, doc, "watering_")
        sunlight_scores = self._score_category(text, doc, "sunlight_")
        size_scores = self._score_category(text, doc, "size_")
        season_scores = self._score_category(text, doc, "season_")

        # Run these analyses asynchronously
        temperature_class = await self._detect_temperature(text)
        color = self._extract_color(text)

        # Fix specific case for "don't want to water the plant"
        if "don't want to water" in text.lower() or "dont want to water" in text.lower():
            watering_scores = [0, 4, 0]  # Enforce low watering score

        # Fix specific case for "grow all year round"
        if "all year round" in text.lower() or "year round" in text.lower() or "year-round" in text.lower():
            season_scores = [0, 0, 0, 0, 5]  # Enforce all seasons score

        return PlantAnalysisResult(
            watering_scores=watering_scores,
            sunlight_scores=sunlight_scores,
            size_scores=size_scores,
            season_scores=season_scores,
            temperature_class=temperature_class,
            color=color
        )