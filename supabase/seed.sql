-- Optional initial portfolio content. IDs make reruns non-destructive.
begin;
insert into public.projects (id, title, description, tech_stack, link, created_at) values
('10000000-0000-4000-8000-000000000001', 'HiFlow Mobile Application', 'Cross-platform mobile features, REST API integrations, and performance improvements for a smooth everyday experience.', array['React Native','State Management'], null, '2026-10-06T04:00:00Z'),
('10000000-0000-4000-8000-000000000002', 'RAG Document Uploader & AI Chatbot', 'An AI assistant that retrieves relevant context from uploaded documents to answer questions grounded in your content.', array['Python','Streamlit','LangChain','RAG'], null, '2026-10-06T03:00:00Z'),
('10000000-0000-4000-8000-000000000003', 'Cassava Leaf Disease Detection', 'Exploring computer vision for leaf disease detection, with YOLO and Vision Transformers and SHAP for model interpretation.', array['YOLO','VIT','SHAP'], null, '2026-10-06T02:00:00Z'),
('10000000-0000-4000-8000-000000000004', 'ANAYANEX & KIDSZY E-Commerce Clone', 'E-commerce experiences built with a modern React stack, Supabase data, and predictable state management.', array['Next.js','Supabase','Redux','Tailwind CSS'], 'https://anayanex.com', '2026-10-06T01:00:00Z')
on conflict (id) do nothing;
insert into public.experience (id, role, company, duration, description, order_id) values
('20000000-0000-4000-8000-000000000001', 'Mobile App Developer', 'HiFlow App', '07/2026–Present', 'Built cross-platform features, integrated REST APIs, and optimized app performance.', 0),
('20000000-0000-4000-8000-000000000002', 'Full Stack Developer', 'ANAYANEX', '01/2025–09/2025', 'Built scalable web solutions, integrated RESTful APIs and Supabase.', 1)
on conflict (id) do nothing;
commit;
