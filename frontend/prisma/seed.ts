import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const pharmacies = [
  {
    name: "Apollo Pharmacy",
    type: "24/7 Medical Store",
    hospital: "Apollo Hospital Complex",
    rating: 4.8,
    reviews: 234,
    lat: 28.6329,
    lng: 77.2195,
    address: "123 Medical Plaza, New Delhi",
    phone: "+91-11-2345-6789",
    available: true,
  },
  {
    name: "Wellness Medical Store",
    type: "Pharmacy",
    hospital: "Downtown Health Clinic",
    rating: 4.5,
    reviews: 189,
    lat: 28.6258,
    lng: 77.2090,
    address: "456 Healthcare Ave, New Delhi",
    phone: "+91-11-3456-7890",
    available: true,
  },
  {
    name: "National Medicos",
    type: "Pharmacy",
    hospital: "National Health Center",
    rating: 4.7,
    reviews: 156,
    lat: 28.6145,
    lng: 77.2300,
    address: "789 Wellness Rd, New Delhi",
    phone: "+91-11-4567-8901",
    available: false,
  },
]

const medicines = [
  {
    name: "Paracetamol",
    description: "Pain reliever and a fever reducer (analgesic and antipyretic).",
    dosageAdult: "500mg-1000mg every 4-6 hours (max 4000mg/day)",
    dosageChild: "10-15 mg/kg per dose every 4-6 hours",
    sideEffects: ["Nausea", "Stomach pain", "Loss of appetite"],
  },
  {
    name: "Ibuprofen",
    description: "Nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.",
    dosageAdult: "200mg-400mg every 4-6 hours as needed",
    dosageChild: "5-10 mg/kg per dose every 6-8 hours",
    sideEffects: ["Upset stomach", "Mild heartburn", "Nausea", "Dizziness"],
  },
  {
    name: "Amoxicillin",
    description: "Penicillin antibiotic that fights bacteria.",
    dosageAdult: "250mg-500mg every 8 hours, or 500mg-875mg every 12 hours",
    dosageChild: "20-40 mg/kg/day in divided doses every 8 to 12 hours",
    sideEffects: ["Diarrhea", "Stomach upset", "Mild skin rash"],
  },
  {
    name: "Cetirizine",
    description: "Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.",
    dosageAdult: "10mg once daily",
    dosageChild: "2.5mg-5mg once daily",
    sideEffects: ["Drowsiness", "Tiredness", "Dry mouth"],
  },
  {
    name: "Omeprazole",
    description: "Proton pump inhibitor that decreases the amount of acid produced in the stomach.",
    dosageAdult: "20mg-40mg once daily before a meal",
    dosageChild: "Consult pediatrician (Not strictly recommended without prescription)",
    sideEffects: ["Headache", "Abdominal pain", "Nausea", "Diarrhea", "Gas"],
  },
  {
    name: "Aspirin",
    description: "Reduces fever and relieves mild to moderate pain from conditions such as muscle aches, toothaches, common cold, and headaches.",
    dosageAdult: "300mg-650mg every 4-6 hours",
    dosageChild: "DO NOT USE IN CHILDREN under 16 due to Reye's syndrome risk",
    sideEffects: ["Upset stomach", "Heartburn", "Risk of bleeding"],
  },
  {
    name: "Cough Syrup (Guaifenesin)",
    description: "Expectorant that helps loosen congestion in your chest and throat.",
    dosageAdult: "200mg-400mg every 4 hours",
    dosageChild: "50mg-100mg every 4 hours",
    sideEffects: ["Dizziness", "Headache", "Nausea", "Vomiting"],
  }
]

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing collections
  await prisma.savedPharmacy.deleteMany()
  await prisma.pharmacy.deleteMany()
  await prisma.medicine.deleteMany()

  // Insert Pharmacies
  console.log("Injecting Pharmacies...")
  for (const pharmacy of pharmacies) {
    await prisma.pharmacy.create({ data: pharmacy })
    console.log(`  ✅ Created Pharmacy: ${pharmacy.name}`)
  }

  // Insert Medicines
  console.log("\nInjecting Medical Catalog...")
  for (const med of medicines) {
    await prisma.medicine.create({ data: med })
    console.log(`  ✅ Created Medicine: ${med.name}`)
  }

  console.log(`\n🎉 Seeded ${pharmacies.length} pharmacies and ${medicines.length} medicines successfully!`)
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
