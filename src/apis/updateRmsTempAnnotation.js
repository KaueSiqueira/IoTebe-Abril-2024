import { AxiosInstance } from "./AxiosInstance";

export async function updateRmsTempAnnotation(spotId, action, annotation, annotationId = null) {
  const api = new AxiosInstance("updatermstempannotation");
  const data = {
    spot_id: spotId,
    action: action,
    title: annotation.title,
    timestamp: Math.floor(annotation.timestamp / 1000),
    description: annotation.description,
    spot_annotation_id: annotationId,
  };

  return api.axiosPut(data);
}
