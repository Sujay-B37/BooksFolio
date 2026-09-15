-- create table book(
--  isbn bigint primary key,
--  title text,
--  author text
-- );

-- create table review (
-- 	isbn bigint references book (isbn),
-- 	rating int,
-- 	description text,
-- 	l_date timestamptz
-- );

-- alter table review
-- add constraint chk_rating
-- check (rating between 0 and 10);

-- select * from review;

-- select * from book;

-- 2013-01-01 08:45:00 PST

-- insert into book
-- values(0385472579,'A book Title','The Author');

-- insert into review
-- values(0385472579,9,'A very knowledgable book.','2026-09-13T09:55:20.977Z')

-- delete from book;

-- alter table review
-- alter column rating type float

-- alter table review
-- alter column l_date type timestamp without time zone

-- select * from book join review on book.isbn = review.isbn;


-- select * from book join review on book.isbn = review.isbn;


