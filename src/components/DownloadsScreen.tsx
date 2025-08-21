import React, { useState, useEffect } from 'react';
import { Download, FileText, Mail, File, Trash2, Eye, RefreshCw, Search, Filter } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface Document {
  id: string;
  type: 'resume' | 'cover-letter' | 'resignation-letter' | 'other-letter';
  title: string;
  createdAt: string;
  updatedAt: string;
  data: any;
}

export function DownloadsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setDocuments([]);
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/get-documents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    setDownloading(document.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('Please sign in to download documents');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/download-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ documentId: document.id })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document.title}.pdf`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download document');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('Please sign in to delete documents');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e9c2316f/delete-document`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ documentId })
      });

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        alert('Document deleted successfully');
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'resume': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'cover-letter': return <Mail className="w-6 h-6 text-green-500" />;
      case 'resignation-letter': return <File className="w-6 h-6 text-orange-500" />;
      case 'other-letter': return <File className="w-6 h-6 text-purple-500" />;
      default: return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'resume': return 'bg-blue-50 border-blue-200';
      case 'cover-letter': return 'bg-green-50 border-green-200';
      case 'resignation-letter': return 'bg-orange-50 border-orange-200';
      case 'other-letter': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'resume', label: 'Resumes' },
    { value: 'cover-letter', label: 'Cover Letters' },
    { value: 'resignation-letter', label: 'Resignation Letters' },
    { value: 'other-letter', label: 'Other Letters' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-800 mb-2">Downloads</h1>
          <p className="text-gray-600">Manage and download your saved documents</p>
        </div>
        <button
          onClick={loadDocuments}
          disabled={loading}
          className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Search documents..."
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg text-gray-600 mb-2">
              {searchQuery || filterType !== 'all' ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first document to see it here'
              }
            </p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div
              key={document.id}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${getDocumentColor(document.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getDocumentIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg text-gray-800 mb-1 truncate">
                      {document.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 capitalize">
                      {document.type.replace('-', ' ')}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Created: {formatDate(document.createdAt)}</span>
                      <span>Updated: {formatDate(document.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    disabled={downloading === document.id}
                    className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                  >
                    {downloading === document.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {!loading && documents.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl text-blue-500 mb-1">
                {documents.filter(d => d.type === 'resume').length}
              </div>
              <div className="text-sm text-gray-600">Resumes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-500 mb-1">
                {documents.filter(d => d.type === 'cover-letter').length}
              </div>
              <div className="text-sm text-gray-600">Cover Letters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-orange-500 mb-1">
                {documents.filter(d => d.type === 'resignation-letter').length}
              </div>
              <div className="text-sm text-gray-600">Resignation Letters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-purple-500 mb-1">
                {documents.filter(d => d.type === 'other-letter').length}
              </div>
              <div className="text-sm text-gray-600">Other Letters</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}