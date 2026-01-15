-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-8uulibpxqebl_documents', 'app-8uulibpxqebl_documents', true);

-- Storage policies for authenticated users
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'app-8uulibpxqebl_documents');

CREATE POLICY "Anyone can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-8uulibpxqebl_documents');

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'app-8uulibpxqebl_documents');

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'app-8uulibpxqebl_documents');
