use bread; 
select user(), DATABASE(); 

show tables; 

create table users(
	u_no int auto_increment primary key, 
	u_id varchar(10) not null unique,
	u_name varchar(5) not null,
	u_pwd varchar(100) not null,
	u_tel char(13) not null unique,
	u_email varchar(30) not null unique,
	u_grade varchar(5) not null default '일반회원',
	u_reg_dt timestamp not null default now(),
	u_mod_dt timestamp default now(),
	u_done tinyint not null default 1
);
create table regions(
	r_no int primary key,
	r_name varchar(5) not null
);
create table stores(
	s_no int auto_increment primary key,
	s_name varchar(20) not null,
	r_no int not null,
	s_desc text not null,
	s_addr varchar(100) not null,
	s_tel varchar(14) not null,
	s_img varchar(100),
	s_latitude varchar(100) not null,
	s_longitude varchar(100) not null,
	foreign key (r_no) references regions (r_no)
	on DELETE cascade  
	on update cascade
);
create table products(
	p_no int auto_increment primary key,
	p_name varchar(10) not null,
	p_price int not null,
	p_desc text not null,
	s_no int not null,
	p_img varchar(100),
	foreign key (s_no) references stores (s_no)
	on DELETE cascade  
	on update cascade
);
create table orders(
	o_no int auto_increment primary key,
	u_no int not null,
	p_no int not null,
	o_reg_dt timestamp not null default now(),
	o_pickup_dt timestamp not null,
	o_cnt int not null default 1,
	foreign key(u_no) references users (u_no),
	foreign key(p_no) references products (p_no)
);
create table board_type(
	bt_no int primary key,
	bt_name varchar(10) not null
);
create table board(
	b_no int auto_increment primary key,
	bt_no int not null,
	u_no int not null,
	b_title varchar(10) not null,
	b_content longtext not null,
	b_reg_dt timestamp not null default now(),
	b_mod_dt timestamp default now(),
	b_done tinyint not null default 1,
	b_cnt int not null default 0,
	foreign key(u_no) references users (u_no),
	foreign key(bt_no) references board_type (bt_no)
	on DELETE cascade  
	on update cascade
);
create table comments(
	c_no int auto_increment primary key,
	b_no int not null,
	u_no int not null,
	c_content longtext not null,
	c_reg_dt timestamp not null default now(),
	c_mod_dt timestamp default now(),
	foreign key(u_no) references users (u_no)
	on DELETE cascade  
	on update cascade,
	foreign key(b_no) references board (b_no)
	on DELETE cascade  
	on update cascade
);

insert into regions values
(1, '서울'),(2, '경기'),(3, '인천'),(4, '강원'),(5, '대구'),
(6, '부산'),(7, '울산'),(8, '경상'),(9, '충청'),(10, '대전'),
(11, '전라'),(12, '광주'),(13, '제주'),(14, '세종');

insert into board_type values
(1, '공지사항'),(2,'QNA');

alter table stores drop column s_latitude;
alter table stores drop column s_longitude;











