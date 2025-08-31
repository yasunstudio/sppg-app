// ===============================
// 34. FEEDBACK SYSTEM
// ===============================
import { PrismaClient, FeedbackType, FeedbackSource, FeedbackStatus } from '../../src/generated/prisma'

const prisma = new PrismaClient()

export default async function seedFeedback() {
  console.log('💬 Seeding feedback system...')

  // Get reference data
  const schools = await prisma.school.findMany({
    orderBy: { name: 'asc' }
  })

  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'asc' }
  })

  if (schools.length === 0) {
    console.log('⚠️  No schools found. Please seed schools first.')
    return
  }

  const feedbacks = [
    // Positive feedback - Food Quality
    {
      type: FeedbackType.FOOD_QUALITY,
      rating: 5,
      message: 'Anak-anak sangat suka dengan nasi ayam goreng hari ini. Bumbu pas dan ayamnya empuk. Terima kasih!',
      source: FeedbackSource.TEACHER,
      schoolId: schools[0]?.id,
      studentId: null,
      status: FeedbackStatus.RESOLVED,
      response: 'Terima kasih atas feedback positifnya. Kami akan mempertahankan kualitas masakan ini.',
      respondedAt: new Date('2025-08-05T15:30:00Z'),
      createdAt: new Date('2025-08-05T14:00:00Z')
    },

    {
      type: FeedbackType.FOOD_QUALITY,
      rating: 4,
      message: 'Menu hari ini enak, tapi mungkin nasinya bisa dikurangi sedikit untuk anak kelas 1',
      source: FeedbackSource.TEACHER,
      schoolId: schools[1]?.id,
      studentId: null,
      status: FeedbackStatus.RESOLVED,
      response: 'Noted, kami akan sesuaikan porsi untuk anak kelas rendah. Terima kasih sarannya.',
      respondedAt: new Date('2025-08-06T10:15:00Z'),
      createdAt: new Date('2025-08-06T09:30:00Z')
    },

    // Student feedback through teacher
    {
      type: FeedbackType.VARIETY,
      rating: 4,
      message: 'Siswa kelas 3A minta lebih sering ada menu telur dadar karena mereka suka sekali',
      source: FeedbackSource.TEACHER,
      schoolId: schools[2]?.id,
      studentId: students[5]?.id,
      status: FeedbackStatus.RESOLVED,
      response: 'Akan kami pertimbangkan untuk menambah frekuensi menu telur dadar dalam planning bulanan.',
      respondedAt: new Date('2025-08-07T11:00:00Z'),
      createdAt: new Date('2025-08-07T08:45:00Z')
    },

    // Delivery service feedback
    {
      type: FeedbackType.DELIVERY_SERVICE,
      rating: 5,
      message: 'Tim pengiriman sangat punctual dan ramah. Makanan sampai masih hangat dan packaging rapi.',
      source: FeedbackSource.SCHOOL_ADMIN,
      schoolId: schools[3]?.id,
      studentId: null,
      status: FeedbackStatus.RESOLVED,
      response: 'Senang mendengar pelayanan delivery kami memuaskan. Tim akan terus dipertahankan kinerjanya.',
      respondedAt: new Date('2025-08-08T14:20:00Z'),
      createdAt: new Date('2025-08-08T13:15:00Z')
    },

    // Complaint - Food Quality Issue
    {
      type: FeedbackType.COMPLAINT,
      rating: 2,
      message: 'Menu ikan hari ini agak amis dan beberapa siswa mengeluh. Mungkin ikannya kurang fresh?',
      source: FeedbackSource.TEACHER,
      schoolId: schools[4]?.id,
      studentId: null,
      status: FeedbackStatus.RESOLVED,
      response: 'Mohon maaf atas ketidaknyamanan ini. Kami sudah mengganti supplier ikan dan meningkatkan QC. Terima kasih laporannya.',
      respondedAt: new Date('2025-08-19T16:30:00Z'),
      createdAt: new Date('2025-08-19T14:45:00Z')
    },

    // Portion size feedback
    {
      type: FeedbackType.PORTION_SIZE,
      rating: 3,
      message: 'Porsi untuk anak kelas 6 sepertinya kurang, mereka masih lapar setelah makan',
      source: FeedbackSource.TEACHER,
      schoolId: schools[5]?.id,
      studentId: null,
      status: FeedbackStatus.IN_PROGRESS,
      response: 'Sedang kami review guideline porsi untuk siswa kelas tinggi. Akan ada penyesuaian minggu depan.',
      respondedAt: new Date('2025-08-20T10:00:00Z'),
      createdAt: new Date('2025-08-20T09:15:00Z')
    },

    // Parent feedback
    {
      type: FeedbackType.GENERAL,
      rating: 5,
      message: 'Anak saya jadi lebih semangat sekolah karena makanannya enak. Program SPPG ini sangat membantu keluarga.',
      source: FeedbackSource.PARENT,
      schoolId: schools[6]?.id,
      studentId: students[12]?.id,
      status: FeedbackStatus.RESOLVED,
      response: 'Terima kasih dukungannya. Senang mendengar program ini berdampak positif untuk anak-anak.',
      respondedAt: new Date('2025-08-21T15:45:00Z'),
      createdAt: new Date('2025-08-21T14:30:00Z')
    },

    // Menu variety request
    {
      type: FeedbackType.VARIETY,
      rating: 4,
      message: 'Boleh request menu sayur asem atau sop? Anak-anak kayaknya suka kuah-kuahan',
      source: FeedbackSource.TEACHER,
      schoolId: schools[7]?.id,
      studentId: null,
      status: FeedbackStatus.OPEN,
      response: null,
      respondedAt: null,
      createdAt: new Date('2025-08-25T11:30:00Z')
    },

    // Multiple students feedback
    {
      type: FeedbackType.FOOD_QUALITY,
      rating: 5,
      message: 'Semua siswa kelas 2B bilang nasi telur dadar hari ini "enak banget bu guru!"',
      source: FeedbackSource.TEACHER,
      schoolId: schools[8]?.id,
      studentId: null,
      status: FeedbackStatus.RESOLVED,
      response: 'Alhamdulillah, terima kasih feedback dari anak-anak. Chef kami akan senang mendengar ini!',
      respondedAt: new Date('2025-08-26T16:00:00Z'),
      createdAt: new Date('2025-08-26T14:20:00Z')
    },

    // Delivery timing issue
    {
      type: FeedbackType.DELIVERY_SERVICE,
      rating: 3,
      message: 'Pengiriman hari ini terlambat 20 menit. Siswa sudah pada lapar dan agak rewel.',
      source: FeedbackSource.SCHOOL_ADMIN,
      schoolId: schools[9]?.id,
      studentId: null,
      status: FeedbackStatus.RESOLVED,
      response: 'Mohon maaf atas keterlambatan. Ada kendala lalu lintas. Kami akan improve route planning.',
      respondedAt: new Date('2025-08-27T13:45:00Z'),
      createdAt: new Date('2025-08-27T12:30:00Z')
    },

    // Packaging feedback
    {
      type: FeedbackType.GENERAL,
      rating: 4,
      message: 'Kemasan baru lebih bagus dan tidak mudah bocor. Tapi mungkin bisa dibuat lebih eco-friendly?',
      source: FeedbackSource.SCHOOL_ADMIN,
      schoolId: schools[10]?.id,
      studentId: null,
      status: FeedbackStatus.IN_PROGRESS,
      response: 'Sedang explore kemasan biodegradable. Target implementasi Oktober 2025. Terima kasih sarannya.',
      respondedAt: new Date('2025-08-28T11:15:00Z'),
      createdAt: new Date('2025-08-28T10:00:00Z')
    },

    // Temperature issue
    {
      type: FeedbackType.COMPLAINT,
      rating: 2,
      message: 'Makanan sampai sudah agak dingin. Mungkin perlu ada solusi untuk menjaga kehangatan?',
      source: FeedbackSource.TEACHER,
      schoolId: schools[11]?.id,
      studentId: null,
      status: FeedbackStatus.IN_PROGRESS,
      response: 'Sedang uji coba container thermal baru dan adjust delivery time. Mohon bersabar.',
      respondedAt: new Date('2025-08-29T09:30:00Z'),
      createdAt: new Date('2025-08-29T08:45:00Z')
    },

    // Recent feedback - August end
    {
      type: FeedbackType.FOOD_QUALITY,
      rating: 4,
      message: 'Menu minggu ini variative dan anak-anak antusias. Keep up the good work!',
      source: FeedbackSource.TEACHER,
      schoolId: schools[12]?.id,
      studentId: null,
      status: FeedbackStatus.OPEN,
      response: null,
      respondedAt: null,
      createdAt: new Date('2025-08-30T15:30:00Z')
    },

    // Future improvement suggestion
    {
      type: FeedbackType.VARIETY,
      rating: 4,
      message: 'Mungkin bisa ada menu spesial untuk hari Jumat? Seperti nasi kuning atau menu tradisional lainnya?',
      source: FeedbackSource.SCHOOL_ADMIN,
      schoolId: schools[13]?.id,
      studentId: null,
      status: FeedbackStatus.OPEN,
      response: null,
      respondedAt: null,
      createdAt: new Date('2025-08-31T10:00:00Z')
    }
  ]

  for (const feedbackData of feedbacks) {
    const existing = await prisma.feedback.findFirst({
      where: {
        message: feedbackData.message,
        schoolId: feedbackData.schoolId,
        createdAt: feedbackData.createdAt
      }
    })

    if (!existing) {
      await prisma.feedback.create({
        data: feedbackData
      })
    }
  }

  const feedbackCount = await prisma.feedback.count()
  console.log(`✅ Feedback seeded: ${feedbackCount} feedback entries`)
}
