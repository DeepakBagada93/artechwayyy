-- Add category column to posts table
alter table posts
add column category text;

-- Create a function to get distinct categories
create or replace function get_distinct_categories()
returns table(category text) as $$
begin
  return query
  select distinct p.category
  from posts p
  where p.category is not null;
end;
$$ language plpgsql;

-- Grant execute permission on the function to the anon role
grant execute on function get_distinct_categories() to anon;
