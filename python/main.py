import spacy
import httpx
from typing import Dict, List, Set, Tuple
from fastapi import FastAPI
from pydantic import BaseModel
from geopy.geocoders import Nominatim
import asyncio
import re
import analyze_plant_needs
import uvicorn

app = FastAPI()
analyzer = analyze_plant_needs.UnifiedPlantAnalyzer('5fac1d4b3dmshe8dc82d36adf1b3p178f45jsncaec070a68fb')


@app.post("/analyze_plant_needs")
async def analyze_plant_needs(data: analyze_plant_needs.RequestData):
    """Unified endpoint for all plant analysis needs"""
    try:
        result = await analyzer.analyze(data.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)