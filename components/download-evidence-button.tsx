"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";

interface DownloadEvidenceButtonProps {
  submissionId: string;
  missionTitle: string;
}

interface EvidenceItem {
  type: 'text' | 'photo' | 'video' | 'audio' | 'document';
  data: string;
  metadata?: {
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
  };
}

export function DownloadEvidenceButton({ submissionId, missionTitle }: DownloadEvidenceButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const supabase = createClient();

      // Get submission with evidence
      const { data: submission, error } = await supabase
        .from('mission_submissions')
        .select('guidance_evidence')
        .eq('id', submissionId)
        .single();

      if (error) throw error;

      const guidanceEvidence = submission.guidance_evidence as unknown as Record<string, EvidenceItem[]>;
      
      if (!guidanceEvidence || Object.keys(guidanceEvidence).length === 0) {
        toast({
          title: "No Evidence",
          description: "This submission has no evidence files to download.",
          variant: "destructive",
        });
        return;
      }

      // Create a ZIP file
      const zip = new JSZip();
      let fileCount = 0;

      // Process each step's evidence
      for (const [stepId, evidenceItems] of Object.entries(guidanceEvidence)) {
        const stepFolder = zip.folder(`step_${stepId}`);
        
        if (!stepFolder) continue;

        for (let i = 0; i < evidenceItems.length; i++) {
          const item = evidenceItems[i];
          
          if (item.type === 'text') {
            // Save text evidence as txt file
            const textContent = item.data;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            stepFolder.file(`text_evidence_${i + 1}_${timestamp}.txt`, textContent);
            fileCount++;
          } else if (item.type === 'photo' || item.type === 'video' || item.type === 'audio' || item.type === 'document') {
            // Download file from storage
            const storagePath = item.data;
            
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('mission-submissions')
              .download(storagePath);

            if (downloadError) {
              console.error(`Error downloading ${storagePath}:`, downloadError);
              continue;
            }

            // Get file extension from metadata or path
            let extension = item.metadata?.fileName?.split('.').pop() || 
                           storagePath.split('.').pop();
            
            // Fallback extensions based on type
            if (!extension) {
              switch (item.type) {
                case 'photo':
                  extension = 'jpg';
                  break;
                case 'video':
                  extension = 'mp4';
                  break;
                case 'audio':
                  extension = 'm4a';
                  break;
                case 'document':
                  extension = 'pdf';
                  break;
                default:
                  extension = 'file';
              }
            }
            
            const fileName = item.metadata?.fileName || `${item.type}_${i + 1}.${extension}`;
            
            stepFolder.file(fileName, fileData);
            fileCount++;
          }
        }
      }

      if (fileCount === 0) {
        toast({
          title: "No Files",
          description: "No downloadable files found in this submission.",
          variant: "destructive",
        });
        return;
      }

      // Generate and download the ZIP
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${missionTitle.replace(/[^a-z0-9]/gi, '_')}_evidence.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Downloaded ${fileCount} evidence file(s).`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download evidence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download className="h-4 w-4 mr-2" />
      {isDownloading ? "Downloading..." : "Download Evidence"}
    </Button>
  );
}
