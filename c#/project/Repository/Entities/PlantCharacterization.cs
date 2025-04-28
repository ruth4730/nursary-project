using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public enum sunshainLevel
    {
        many,little,avg
    }
    public enum irrigation 
    {
        many, little, avg
    }
    public enum maxSize
    {
        flowerPot,smallGround,bigGround
    }
    public enum season
    {
        summer,winter,spring,fall,all
    }
    public enum temperature
    {
        cold,conditioned,subtropical,desert,tropical,equatorial
    }
    public class PlantCharacterization
    {
        public int Id { get; set; }
        public virtual ICollection<Plant>? Plants { get; set; }
        public sunshainLevel Sun {  get; set; }
        public irrigation Irrigation { get; set; }
        public maxSize MaxSize {  get; set; }
        public season Season { get; set; }
        public temperature temperature { get; set; }
    }
}
