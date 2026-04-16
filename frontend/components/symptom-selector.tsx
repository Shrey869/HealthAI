"use client"

import { useState } from "react"
import { X, Search, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const allSymptoms = [
  // General & Systemic
  { id: "fever", label: "Fever", category: "General" },
  { id: "chills", label: "Chills", category: "General" },
  { id: "fatigue", label: "Fatigue / Weakness", category: "General" },
  { id: "unexplained-weight-loss", label: "Unexplained Weight Loss", category: "General" },
  { id: "unexplained-weight-gain", label: "Unexplained Weight Gain", category: "General" },
  { id: "night-sweats", label: "Night Sweats", category: "General" },
  { id: "loss-appetite", label: "Loss of Appetite", category: "General" },
  { id: "excessive-thirst", label: "Excessive Thirst", category: "General" },
  { id: "swelling", label: "Swelling (Edema)", category: "General" },

  // Head, Eyes, Ears, Nose, Throat (HEENT)
  { id: "headache", label: "Headache", category: "Head & Neck" },
  { id: "sore-throat", label: "Sore Throat", category: "Head & Neck" },
  { id: "runny-nose", label: "Runny Nose", category: "Head & Neck" },
  { id: "stuffy-nose", label: "Nasal Congestion", category: "Head & Neck" },
  { id: "earache", label: "Ear Pain", category: "Head & Neck" },
  { id: "hearing-loss", label: "Hearing Loss / Ringing", category: "Head & Neck" },
  { id: "blurry-vision", label: "Blurry Vision", category: "Eyes" },
  { id: "eye-pain", label: "Eye Pain / Redness", category: "Eyes" },
  { id: "light-sensitivity", label: "Sensitivity to Light", category: "Eyes" },
  { id: "toothache", label: "Tooth or Gum Pain", category: "Head & Neck" },
  { id: "difficulty-swallowing", label: "Difficulty Swallowing", category: "Head & Neck" },

  // Respiratory
  { id: "cough-dry", label: "Dry Cough", category: "Respiratory" },
  { id: "cough-wet", label: "Cough with Phlegm", category: "Respiratory" },
  { id: "shortness-breath", label: "Shortness of Breath", category: "Respiratory" },
  { id: "wheezing", label: "Wheezing", category: "Respiratory" },
  { id: "chest-tightness", label: "Chest Tightness", category: "Respiratory" },
  { id: "coughing-blood", label: "Coughing up Blood", category: "Respiratory" },

  // Cardiovascular
  { id: "chest-pain", label: "Chest Pain / Pressure", category: "Cardiovascular" },
  { id: "palpitations", label: "Heart Palpitations", category: "Cardiovascular" },
  { id: "rapid-heartbeat", label: "Rapid Heartbeat", category: "Cardiovascular" },
  { id: "cold-hands-feet", label: "Cold Hands or Feet", category: "Cardiovascular" },
  { id: "fainting", label: "Fainting / Passing Out", category: "Cardiovascular" },

  // Digestive / Gastrointestinal
  { id: "nausea", label: "Nausea", category: "Digestive" },
  { id: "vomiting", label: "Vomiting", category: "Digestive" },
  { id: "stomach-pain", label: "Abdominal Pain", category: "Digestive" },
  { id: "diarrhea", label: "Diarrhea", category: "Digestive" },
  { id: "constipation", label: "Constipation", category: "Digestive" },
  { id: "bloating", label: "Bloating / Gas", category: "Digestive" },
  { id: "heartburn", label: "Heartburn / Acid Reflux", category: "Digestive" },
  { id: "blood-in-stool", label: "Blood in Stool", category: "Digestive" },
  { id: "jaundice", label: "Yellowing of Skin/Eyes", category: "Digestive" },

  // Musculoskeletal
  { id: "muscle-aches", label: "Muscle Aches", category: "Musculoskeletal" },
  { id: "joint-pain", label: "Joint Pain", category: "Musculoskeletal" },
  { id: "joint-swelling", label: "Joint Swelling / Stiffness", category: "Musculoskeletal" },
  { id: "back-pain", label: "Back Pain", category: "Musculoskeletal" },
  { id: "neck-pain", label: "Neck Pain / Stiffness", category: "Musculoskeletal" },
  { id: "muscle-cramps", label: "Muscle Cramps / Spasms", category: "Musculoskeletal" },

  // Neurological & Mental Health
  { id: "dizziness", label: "Dizziness / Vertigo", category: "Neurological" },
  { id: "numbness", label: "Numbness / Tingling", category: "Neurological" },
  { id: "confusion", label: "Confusion / Memory Loss", category: "Neurological" },
  { id: "seizures", label: "Seizures / Tremors", category: "Neurological" },
  { id: "loss-taste-smell", label: "Loss of Taste or Smell", category: "Neurological" },
  { id: "difficulty-speaking", label: "Difficulty Speaking", category: "Neurological" },
  { id: "anxiety", label: "Anxiety / Panic Attacks", category: "Mental Health" },
  { id: "depression", label: "Depression / Persistent Sadness", category: "Mental Health" },
  { id: "insomnia", label: "Difficulty Sleeping", category: "Mental Health" },

  // Dermatological / Skin
  { id: "skin-rash", label: "Skin Rash", category: "Skin & Hair" },
  { id: "itching", label: "Severe Itching", category: "Skin & Hair" },
  { id: "hives", label: "Hives / Welts", category: "Skin & Hair" },
  { id: "dry-skin", label: "Dry or Peeling Skin", category: "Skin & Hair" },
  { id: "hair-loss", label: "Hair Loss", category: "Skin & Hair" },
  { id: "nail-changes", label: "Changes in Nails", category: "Skin & Hair" },
  { id: "bruising-easily", label: "Bruising Easily", category: "Skin & Hair" },

  // Urological / Reproductive
  { id: "frequent-urination", label: "Frequent Urination", category: "Urinary" },
  { id: "painful-urination", label: "Painful Urination", category: "Urinary" },
  { id: "blood-in-urine", label: "Blood in Urine", category: "Urinary" },
  { id: "pelvic-pain", label: "Pelvic Pain", category: "Reproductive" },
  { id: "irregular-periods", label: "Irregular Periods", category: "Reproductive" },
]

interface SymptomSelectorProps {
  selectedSymptoms: string[]
  onSymptomsChange: (symptoms: string[]) => void
}

export function SymptomSelector({ selectedSymptoms, onSymptomsChange }: SymptomSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSymptoms = allSymptoms.filter(symptom =>
    symptom.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symptom.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId))
    } else {
      onSymptomsChange([...selectedSymptoms, symptomId])
    }
  }

  const removeSymptom = (symptomId: string) => {
    onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId))
  }

  const categories = [...new Set(filteredSymptoms.map(s => s.category))]

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search symptoms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Selected Symptoms ({selectedSymptoms.length})</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedSymptoms.map(symptomId => {
                const symptom = allSymptoms.find(s => s.id === symptomId)
                if (!symptom) return null
                return (
                  <motion.div
                    key={symptomId}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="pl-3 pr-2 py-1.5 glass bg-primary text-primary-foreground border-none hover:bg-primary/90 cursor-pointer shadow-lg shadow-primary/20"
                      onClick={() => removeSymptom(symptomId)}
                    >
                      {symptom.label}
                      <X className="ml-2 h-3 w-3" />
                    </Badge>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Symptom Categories */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <p className="text-sm font-medium text-muted-foreground mb-2">{category}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredSymptoms
                .filter(s => s.category === category)
                  .map(symptom => {
                    const isSelected = selectedSymptoms.includes(symptom.id)
                    return (
                      <motion.button
                        key={symptom.id}
                        type="button"
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all shadow-sm",
                          isSelected
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                            : "border-white/10 glass hover:border-primary/50 text-foreground"
                        )}
                      >
                        <span>{symptom.label}</span>
                        {isSelected && <Check className="h-4 w-4 shrink-0" />}
                      </motion.button>
                    )
                  })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { allSymptoms }
