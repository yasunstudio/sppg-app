import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export async function seedNutritionConsultations() {
  console.log('💬 Seeding nutrition consultations...')
  
  // Get students for consultations
  const students = await prisma.student.findMany({
    select: { id: true, name: true, schoolId: true }
  })

  // Get nutritionist user
  const nutritionist = await prisma.user.findFirst({
    where: { email: 'sari.nutrition@sppg-purwakarta.go.id' },
    select: { id: true, name: true }
  })

  if (students.length === 0 || !nutritionist) {
    console.log('⚠️ No students or nutritionist found, skipping nutrition consultations seeding')
    return
  }

  const consultations = [
    // Consultation cases for August 2025
    {
      id: 'nc-aug-001',
      studentId: students[0].id,
      question: 'Anak saya kurang suka makan sayur, bagaimana cara membuatnya tertarik untuk makan sayur?',
      answer: 'Coba variasikan cara penyajian sayur, seperti dibuat sup dengan bentuk menarik, atau dicampur dengan makanan favorit anak. Bisa juga melibatkan anak dalam proses memasak agar lebih tertarik.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-002', 
      studentId: students[1]?.id || students[0].id,
      question: 'Apakah porsi makan di SPPG sudah cukup untuk kebutuhan gizi anak saya yang aktif?',
      answer: 'Porsi SPPG sudah dihitung sesuai Angka Kecukupan Gizi untuk anak sekolah. Namun jika anak sangat aktif, bisa ditambah dengan camilan sehat di rumah seperti buah atau kacang-kacangan.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-003',
      studentId: students[2]?.id || students[0].id,
      question: 'Anak saya alergi telur, apakah ada menu alternatif di SPPG?',
      answer: 'Ya, kami menyediakan menu alternatif untuk anak dengan alergi. Tim dapur sudah diinformasikan dan akan memberikan protein pengganti seperti tempe, tahu, atau ikan untuk anak Anda.',
      status: 'CLOSED' as const
    },
    {
      id: 'nc-aug-004',
      studentId: students[3]?.id || students[0].id,
      question: 'Bagaimana cara mengetahui apakah anak mendapat gizi yang cukup dari program SPPG?',
      answer: 'Kami melakukan monitoring rutin pertumbuhan anak melalui penimbangan dan pengukuran tinggi badan setiap bulan. Orangtua akan mendapat laporan perkembangan gizi anak secara berkala.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-005',
      studentId: students[4]?.id || students[0].id,
      question: 'Anak saya sering susah makan di pagi hari, apakah ini normal?',
      answer: 'Hal ini cukup umum pada anak. Pastikan anak sarapan meski sedikit, dan program SPPG akan membantu memenuhi kebutuhan gizi siang hari. Coba berikan sarapan ringan yang disukai anak.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-006',
      studentId: students[5]?.id || students[0].id,
      question: 'Apakah aman jika anak minum susu setelah makan dari program SPPG?',
      answer: 'Ya, aman. Namun sebaiknya beri jeda 30 menit setelah makan untuk membantu penyerapan zat besi dari makanan. Susu bisa menghambat penyerapan zat besi jika diminum bersamaan.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-007',
      studentId: students[6]?.id || students[0].id,
      question: 'Anak saya berat badannya kurang, apa yang bisa dilakukan?',
      answer: 'Kami akan melakukan assessment lebih detail dan menyesuaikan porsi makan anak. Juga akan berkoordinasi dengan dokter anak jika diperlukan. Orangtua bisa memberikan makanan tambahan yang bergizi di rumah.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-008',
      studentId: students[7]?.id || students[0].id,
      question: 'Mengapa menu SPPG sering ada ikan? Anak saya tidak suka ikan.',
      answer: 'Ikan adalah sumber protein dan omega-3 yang penting untuk perkembangan otak anak. Kami bisa menyesuaikan cara pengolahan agar lebih disukai anak, seperti dibuat nugget ikan atau dicampur dalam makanan lain.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-009',
      studentId: students[8]?.id || students[0].id,
      question: 'Bolehkah anak bawa bekal tambahan dari rumah?',
      answer: 'Boleh, asalkan makanan tersebut sehat dan tidak mengganggu nafsu makan untuk menu SPPG. Sebaiknya berupa buah-buahan atau camilan sehat sebagai pelengkap.',
      status: 'ANSWERED' as const
    },
    {
      id: 'nc-aug-010',
      studentId: students[9]?.id || students[0].id,
      question: 'Apakah ada program edukasi gizi untuk orangtua?',
      answer: 'Ya, kami mengadakan workshop gizi orangtua setiap bulan. Workshop berikutnya akan membahas tentang menu seimbang di rumah dan cara mengatasi anak susah makan.',
      status: 'ANSWERED' as const
    },
    // Some pending consultations
    {
      id: 'nc-aug-011',
      studentId: students[10]?.id || students[0].id,
      question: 'Anak saya sering sakit perut setelah makan, apakah ada yang salah dengan menu SPPG?',
      answer: null,
      status: 'PENDING' as const
    },
    {
      id: 'nc-aug-012',
      studentId: students[11]?.id || students[0].id,
      question: 'Apakah menu SPPG bisa disesuaikan untuk anak vegetarian?',
      answer: null,
      status: 'PENDING' as const
    }
  ]

  console.log(`Akan membuat ${consultations.length} nutrition consultations...`)

  // Create consultations with upsert
  for (const consultation of consultations) {
    await prisma.nutritionConsultation.upsert({
      where: { id: consultation.id },
      update: {
        question: consultation.question,
        answer: consultation.answer,
        status: consultation.status
      },
      create: consultation
    })
  }

  console.log(`✅ Created ${consultations.length} nutrition consultation records`)
}

export default seedNutritionConsultations
