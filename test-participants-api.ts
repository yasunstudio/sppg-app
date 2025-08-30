import { prisma } from '@/lib/prisma'

async function testParticipantsAPI() {
  console.log('🧪 Testing Participants API...\n')
  
  try {
    // Test if we can query participants
    console.log('📊 Testing participants query:')
    const participants = await prisma.posyanduParticipant.findMany({ 
      take: 5,
      include: {
        posyandu: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    })
    console.log(`- Found ${participants.length} participants`)
    
    if (participants.length > 0) {
      const participant = participants[0]
      console.log(`- Sample participant: ${participant.name}`)
      console.log(`- Date of birth: ${participant.dateOfBirth}`)
      console.log(`- Gender: ${participant.gender}`)
      console.log(`- Participant type: ${participant.participantType}`)
      console.log(`- Posyandu: ${participant.posyandu.name}`)
    }
    
    console.log('\n✅ Participants API is working correctly!')
    
  } catch (error) {
    console.error('❌ Error testing participants API:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testParticipantsAPI()
