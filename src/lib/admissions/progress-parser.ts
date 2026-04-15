export interface ProgressMarker {
  step: string;
  requirement: string;
  status: "complete" | "pending" | "needs-revision";
}

export interface UploadRequest {
  requirementId: string;
  label: string;
  description: string;
  acceptedFormats?: string[];
}

export function parseProgressMarkers(content: string): ProgressMarker[] {
  const regex = /<!--PROGRESS:(.*?)-->/g;
  const markers: ProgressMarker[] = [];
  let match;
  while ((match = regex.exec(content))) {
    try {
      markers.push(JSON.parse(match[1]));
    } catch {}
  }
  return markers;
}

export function parseUploadRequests(content: string): UploadRequest[] {
  const regex = /<!--UPLOAD:(.*?)-->/g;
  const requests: UploadRequest[] = [];
  let match;
  while ((match = regex.exec(content))) {
    try {
      requests.push(JSON.parse(match[1]));
    } catch {}
  }
  return requests;
}

export function stripMarkers(content: string): string {
  return content.replace(/<!--(?:PROGRESS|UPLOAD):.*?-->/g, "").trim();
}
