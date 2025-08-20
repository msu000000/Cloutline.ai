import React, { useState } from 'react';
import { Download, FileText, Table, FileImage, Calendar, Filter } from 'lucide-react';
import { ExportOptions, Hook } from '../types';

interface AdvancedExportProps {
  isOpen: boolean;
  onClose: () => void;
  hooks: Hook[];
  favorites: Hook[];
}

const AdvancedExport: React.FC<AdvancedExportProps> = ({ isOpen, onClose, hooks, favorites }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeMetadata: true,
    includePerformance: true,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    categories: []
  });

  const [selectedData, setSelectedData] = useState<'all' | 'favorites' | 'recent'>('all');

  const formatOptions = [
    { value: 'json', label: 'JSON', icon: '📄', description: 'Structured data format' },
    { value: 'csv', label: 'CSV', icon: '📊', description: 'Spreadsheet compatible' },
    { value: 'pdf', label: 'PDF', icon: '📋', description: 'Professional document' },
    { value: 'txt', label: 'Text', icon: '📝', description: 'Plain text format' },
    { value: 'docx', label: 'Word', icon: '📄', description: 'Microsoft Word document' }
  ];

  const handleExport = () => {
    let dataToExport: Hook[] = [];

    switch (selectedData) {
      case 'all':
        dataToExport = hooks;
        break;
      case 'favorites':
        dataToExport = favorites;
        break;
      case 'recent':
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        dataToExport = hooks.filter(hook => new Date(hook.createdAt) >= thirtyDaysAgo);
        break;
    }

    // Filter by date range if specified
    if (exportOptions.dateRange) {
      dataToExport = dataToExport.filter(hook => {
        const hookDate = new Date(hook.createdAt);
        return hookDate >= exportOptions.dateRange!.start && hookDate <= exportOptions.dateRange!.end;
      });
    }

    // Filter by categories if specified
    if (exportOptions.categories && exportOptions.categories.length > 0) {
      dataToExport = dataToExport.filter(hook => 
        exportOptions.categories!.includes(hook.category)
      );
    }

    const exportData = dataToExport.map(hook => ({
      text: hook.text,
      topic: hook.topic,
      category: hook.category,
      engagement: hook.engagement,
      ...(exportOptions.includeMetadata && {
        id: hook.id,
        createdAt: hook.createdAt,
        platform: hook.platform,
        style: hook.style,
        audience: hook.audience
      }),
      ...(exportOptions.includePerformance && hook.performance && {
        performance: hook.performance
      })
    }));

    const filename = `cloutline-export-${Date.now()}`;

    switch (exportOptions.format) {
      case 'json':
        downloadJSON(exportData, filename);
        break;
      case 'csv':
        downloadCSV(exportData, filename);
        break;
      case 'txt':
        downloadTXT(exportData, filename);
        break;
      case 'pdf':
        downloadPDF(exportData, filename);
        break;
      case 'docx':
        downloadDOCX(exportData, filename);
        break;
    }

    onClose();
  };

  const downloadJSON = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, `${filename}.csv`);
  };

  const downloadTXT = (data: any[], filename: string) => {
    const text = data.map((item, index) => 
      `${index + 1}. ${item.text}\n   Topic: ${item.topic}\n   Category: ${item.category}\n   Engagement: ${item.engagement}%\n`
    ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    downloadBlob(blob, `${filename}.txt`);
  };

  const downloadPDF = (data: any[], filename: string) => {
    // This would typically use a PDF library like jsPDF
    // For now, we'll create a simple text-based PDF
    const text = `Cloutline Export Report\n\nGenerated: ${new Date().toLocaleString()}\nTotal Hooks: ${data.length}\n\n` +
      data.map((item, index) => 
        `${index + 1}. ${item.text}\n   Topic: ${item.topic} | Category: ${item.category} | Engagement: ${item.engagement}%\n`
      ).join('\n');
    
    const blob = new Blob([text], { type: 'application/pdf' });
    downloadBlob(blob, `${filename}.pdf`);
  };

  const downloadDOCX = (data: any[], filename: string) => {
    // This would typically use a DOCX library
    // For now, we'll create a rich text format
    const content = `Cloutline Export Report\n\nGenerated: ${new Date().toLocaleString()}\nTotal Hooks: ${data.length}\n\n` +
      data.map((item, index) => 
        `${index + 1}. ${item.text}\n   Topic: ${item.topic} | Category: ${item.category} | Engagement: ${item.engagement}%\n`
      ).join('\n');
    
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    downloadBlob(blob, `${filename}.docx`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const categories = Array.from(new Set([...hooks, ...favorites].map(hook => hook.category)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold">Advanced Export</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-6">
            {/* Data Selection */}
            <div>
              <h4 className="font-semibold mb-3">Select Data</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'all', label: 'All Hooks', count: hooks.length },
                  { value: 'favorites', label: 'Favorites', count: favorites.length },
                  { value: 'recent', label: 'Recent (30d)', count: hooks.filter(h => new Date(h.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedData(option.value as any)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedData === option.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm opacity-75">{option.count} hooks</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <h4 className="font-semibold mb-3">Export Format</h4>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as any }))}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      exportOptions.format === format.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span>{format.icon}</span>
                      <span className="font-medium">{format.label}</span>
                    </div>
                    <div className="text-sm opacity-75">{format.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <h4 className="font-semibold mb-3">Export Options</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Include metadata (IDs, timestamps, settings)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includePerformance}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includePerformance: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Include performance data</span>
                </label>
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Filter by Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        const newCategories = exportOptions.categories?.includes(category)
                          ? exportOptions.categories.filter(c => c !== category)
                          : [...(exportOptions.categories || []), category];
                        setExportOptions(prev => ({ ...prev, categories: newCategories }));
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        exportOptions.categories?.includes(category)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Ready to export {selectedData === 'all' ? hooks.length : selectedData === 'favorites' ? favorites.length : hooks.filter(h => new Date(h.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} hooks
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExport;