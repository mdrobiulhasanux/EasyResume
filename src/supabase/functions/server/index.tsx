import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Enable logging
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to verify user authentication
async function verifyUser(authHeader: string | undefined) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Authentication error:', error);
    return null;
  }
  
  return user;
}

// Signup route
app.post('/make-server-e9c2316f/signup', async (c) => {
  try {
    const { email, password, fullName } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: fullName },
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.text(`Signup failed: ${error.message}`, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.text('Internal server error during signup', 500);
  }
});

// Save document route
app.post('/make-server-e9c2316f/save-document', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.text('Unauthorized', 401);
    }

    const documentData = await c.req.json();
    const documentId = `doc_${user.id}_${Date.now()}`;
    
    const document = {
      id: documentId,
      userId: user.id,
      type: documentData.type,
      title: documentData.title,
      data: documentData.data,
      createdAt: documentData.createdAt,
      updatedAt: documentData.updatedAt
    };

    // Save document to KV store
    await kv.set(`document:${documentId}`, JSON.stringify(document));
    
    // Also save to user's document list
    const userDocsKey = `user_documents:${user.id}`;
    const existingDocs = await kv.get(userDocsKey);
    let docsList = existingDocs ? JSON.parse(existingDocs) : [];
    
    // Add new document ID to the list
    docsList.push(documentId);
    await kv.set(userDocsKey, JSON.stringify(docsList));

    console.log(`Document saved successfully: ${documentId} for user ${user.id}`);
    return c.json({ success: true, documentId });
  } catch (error) {
    console.log('Error saving document:', error);
    return c.text('Failed to save document', 500);
  }
});

// Get user documents route
app.get('/make-server-e9c2316f/get-documents', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.text('Unauthorized', 401);
    }

    const userDocsKey = `user_documents:${user.id}`;
    const docsList = await kv.get(userDocsKey);
    
    if (!docsList) {
      return c.json({ documents: [] });
    }

    const documentIds = JSON.parse(docsList);
    const documents = [];

    for (const docId of documentIds) {
      const docData = await kv.get(`document:${docId}`);
      if (docData) {
        const document = JSON.parse(docData);
        // Don't send the full data, just metadata for listing
        documents.push({
          id: document.id,
          type: document.type,
          title: document.title,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        });
      }
    }

    // Sort by updated date, most recent first
    documents.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return c.json({ documents });
  } catch (error) {
    console.log('Error getting documents:', error);
    return c.text('Failed to get documents', 500);
  }
});

// Download document route
app.post('/make-server-e9c2316f/download-document', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.text('Unauthorized', 401);
    }

    const { documentId } = await c.req.json();
    const docData = await kv.get(`document:${documentId}`);
    
    if (!docData) {
      return c.text('Document not found', 404);
    }

    const document = JSON.parse(docData);
    
    // Verify the document belongs to the user
    if (document.userId !== user.id) {
      return c.text('Unauthorized access to document', 403);
    }

    // Generate PDF content (simplified version)
    const pdfContent = generatePDFContent(document);
    
    // Return as PDF blob
    return new Response(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${document.title}.pdf"`
      }
    });
  } catch (error) {
    console.log('Error downloading document:', error);
    return c.text('Failed to download document', 500);
  }
});

// Delete document route
app.delete('/make-server-e9c2316f/delete-document', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.text('Unauthorized', 401);
    }

    const { documentId } = await c.req.json();
    const docData = await kv.get(`document:${documentId}`);
    
    if (!docData) {
      return c.text('Document not found', 404);
    }

    const document = JSON.parse(docData);
    
    // Verify the document belongs to the user
    if (document.userId !== user.id) {
      return c.text('Unauthorized access to document', 403);
    }

    // Remove document from KV store
    await kv.del(`document:${documentId}`);
    
    // Remove from user's document list
    const userDocsKey = `user_documents:${user.id}`;
    const docsList = await kv.get(userDocsKey);
    
    if (docsList) {
      const documentIds = JSON.parse(docsList);
      const updatedIds = documentIds.filter((id: string) => id !== documentId);
      await kv.set(userDocsKey, JSON.stringify(updatedIds));
    }

    console.log(`Document deleted successfully: ${documentId} for user ${user.id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting document:', error);
    return c.text('Failed to delete document', 500);
  }
});

// Simple PDF content generator (in a real app, use a proper PDF library)
function generatePDFContent(document: any) {
  // This is a simplified PDF generation
  // In a real application, you would use a proper PDF library like jsPDF or PDFKit
  const content = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
72 720 Td
(${document.title}) Tj
0 -50 Td
/F1 12 Tf
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -30 Td
(Document Type: ${document.type.replace('-', ' ').toUpperCase()}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000108 00000 n 
0000000267 00000 n 
0000000510 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
580
%%EOF`;

  return content;
}

// Health check route
app.get('/make-server-e9c2316f/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Default route
app.get('/make-server-e9c2316f/', (c) => {
  return c.text('Resume Builder Server API is running');
});

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.text('Internal Server Error', 500);
});

// Start the server
Deno.serve(app.fetch);