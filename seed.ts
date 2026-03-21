import { db } from './src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const demoUser = await db.user.upsert({
    where: { email: 'demo@exportimport.com' },
    update: {},
    create: {
      email: 'demo@exportimport.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER'
    }
  })

  // Create admin user
  const adminUser = await db.user.upsert({
    where: { email: 'admin@exportimport.com' },
    update: {},
    create: {
      email: 'admin@exportimport.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // Create demo company
  const demoCompany = await db.company.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      name: 'Demo Trading Company',
      description: 'A premium trading company specializing in international exports and imports of quality products.',
      country: 'United States',
      email: 'demo@exportimport.com',
      phone: '+1-555-0123',
      whatsapp: '+1-555-0123',
      isVerified: true,
      verificationStatus: 'APPROVED',
      userId: demoUser.id
    }
  })

  // Create some categories
  const categories = [
    { name: 'Agriculture', type: 'INDUSTRY' as const, description: 'Agricultural products and commodities' },
    { name: 'Textiles', type: 'INDUSTRY' as const, description: 'Textiles and fabrics' },
    { name: 'Machinery', type: 'INDUSTRY' as const, description: 'Industrial machinery and equipment' },
    { name: 'Chemicals', type: 'INDUSTRY' as const, description: 'Chemical products and raw materials' },
    { name: 'Electronics', type: 'INDUSTRY' as const, description: 'Electronic components and devices' },
    { name: 'Food & Beverage', type: 'INDUSTRY' as const, description: 'Food and beverage products' }
  ]

  for (const category of categories) {
    await db.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  // Create some sample products for the demo company
  const products = [
    {
      name: 'Premium Cotton Fabric',
      description: 'High-quality 100% cotton fabric suitable for clothing and textiles',
      price: 5.99,
      currency: 'USD',
      moq: 100,
      images: JSON.stringify(['/api/placeholder/400/300']),
      companyId: demoCompany.id
    },
    {
      name: 'Organic Coffee Beans',
      description: 'Premium organic coffee beans from sustainable farms',
      price: 12.50,
      currency: 'USD',
      moq: 50,
      images: JSON.stringify(['/api/placeholder/400/300']),
      companyId: demoCompany.id
    },
    {
      name: 'Industrial CNC Machine',
      description: 'High-precision CNC machine for manufacturing',
      price: 25000.00,
      currency: 'USD',
      moq: 1,
      images: JSON.stringify(['/api/placeholder/400/300']),
      companyId: demoCompany.id
    }
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { 
        companyId_name: {
          companyId: product.companyId,
          name: product.name
        }
      },
      update: {},
      create: product
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })