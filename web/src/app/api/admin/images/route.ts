import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    const materialsDir = path.join(process.cwd(), 'public/materials')
    const portfolioDir = path.join(process.cwd(), 'public/portfolio')
    
    // Ensure directories exist
    await Promise.all([
      mkdir(uploadsDir, { recursive: true }),
      mkdir(materialsDir, { recursive: true }),
      mkdir(portfolioDir, { recursive: true })
    ])
    
    // Read directories
    const [uploads, materials, portfolio] = await Promise.all([
      readDirectory(uploadsDir),
      readDirectory(materialsDir),
      readDirectory(portfolioDir)
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        uploads: uploads,
        materials: materials,
        portfolio: portfolio
      }
    })
  } catch (error) {
    console.error('Error reading image directories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read image directories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const alt = formData.get('alt') as string
    const description = formData.get('description') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      )
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }
    
    let targetDir = ''
    let uploadedFileName = ''
    
    // Determine target directory based on type
    switch (type) {
      case 'material':
        targetDir = path.join(process.cwd(), 'public/materials')
        break
      case 'portfolio':
        targetDir = path.join(process.cwd(), 'public/portfolio')
        break
      case 'upload':
        targetDir = path.join(process.cwd(), 'public/uploads')
        break
      default:
        targetDir = path.join(process.cwd(), 'public/uploads')
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    uploadedFileName = `${timestamp}${fileExtension}`
    const filePath = path.join(targetDir, uploadedFileName)
    
    // Save file
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        filename: uploadedFileName,
        path: `/${type}/${uploadedFileName}`,
        type: type,
        size: file.size,
        alt: alt,
        description: description
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url!)
    const filename = searchParams.get('filename')
    const type = searchParams.get('type') || 'upload'
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      )
    }
    
    let targetDir = ''
    switch (type) {
      case 'material':
        targetDir = path.join(process.cwd(), 'public/materials')
        break
      case 'portfolio':
        targetDir = path.join(process.cwd(), 'public/portfolio')
        break
      default:
        targetDir = path.join(process.cwd(), 'public/uploads')
    }
    
    const filePath = path.join(targetDir, filename)
    
    // Delete file
    await unlink(filePath)
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

async function readDirectory(dirPath: string): Promise<Array<{
  name: string
  path: string
  size: number
  modified: string
  type: 'file'
}>> {
  try {
    const fs = await import('fs/promises')
    const items = await fs.readdir(dirPath)
    
    const files = []
    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const stats = await fs.stat(itemPath)
      
      if (stats.isFile()) {
        files.push({
          name: item,
          path: `/${path.basename(dirPath)}/${item}`,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          type: 'file' as const
        })
      }
    }
    
    return files
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}
