create table documents (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete set null,
  related_type text not null,
  related_id uuid,
  title text not null,
  document_type text not null,
  storage_provider text not null default 'local',
  storage_path text,
  original_file_name text,
  mime_type text,
  size_bytes integer,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint documents_storage_provider_check
    check (storage_provider in ('local', 's3', 'r2'))
);

create index documents_vendor_id_idx
  on documents (vendor_id);

create index documents_related_idx
  on documents (related_type, related_id);
