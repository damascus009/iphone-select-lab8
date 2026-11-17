-- Only service_role can call this atomic guard. No contact contents are stored.
create table if not exists public.contact_limits (
  key text primary key,
  started_at timestamptz not null default now(),
  attempts integer not null default 1
);
alter table public.contact_limits enable row level security;
revoke all on public.contact_limits from anon, authenticated;
create or replace function public.allow_contact(p_key text) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare n integer;
begin
  if length(p_key) <> 64 then return false; end if;
  delete from public.contact_limits where started_at < now() - interval '1 day';
  insert into public.contact_limits(key) values(p_key)
  on conflict(key) do update set
    attempts = case when contact_limits.started_at < now() - interval '10 minutes' then 1 else contact_limits.attempts + 1 end,
    started_at = case when contact_limits.started_at < now() - interval '10 minutes' then now() else contact_limits.started_at end
  returning attempts into n;
  return n <= 3;
end $$;
revoke all on function public.allow_contact(text) from public,anon,authenticated;
grant execute on function public.allow_contact(text) to service_role;
