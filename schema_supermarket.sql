create database supermarket_project_2;
use supermarket_project_2;

create table users_table(
	user_id int auto_increment,
	first_name varchar(255),
    last_name varchar(255),
    username varchar(255),
    Id_number int,
	password varchar(255),
    city varchar(255),
    street varchar(255),
    isAdmin bool default 0,    
	primary key (user_id));

insert into users_table(first_name,last_name,username,Id_number,password,city,street,isAdmin)
 values ("adi","min","adi_min@gmail.com",324232311,'$2b$10$tL1XaeL0gZzTaTe.2YImD.ZjkvwnTyupM0azoZYaJ9q9Kg7VHCRP2',"Tel-Aviv","Hyarkon 7",true);

 insert into users_table(first_name,last_name,username,Id_number,password,city,street,isAdmin)
 values ("Guy"	,"Someyoung","s_y_g@gmail.com",  333232311,'$2b$10$tL1XaeL0gZzTaTe.2YImD.ZjkvwnTyupM0azoZYaJ9q9Kg7VHCRP2',"Haifa",    	  "Horev 77",false),
		("Hu"	,"Beshelo"	,"h_blo@gmail.com",  333565311,'$2b$10$tL1XaeL0gZzTaTe.2YImD.ZjkvwnTyupM0azoZYaJ9q9Kg7VHCRP2',"Rishon Lezion","College 41",false),
        ("Hoo"	,"Beshelo"	,"ho_blo@gmail.com", 333565311,"$2b$10$tL1XaeL0gZzTaTe.2YImD.ZjkvwnTyupM0azoZYaJ9q9Kg7VHCRP2","Rishon Lezion","College 41",false),
		("Ezra"	,"Zahti"	,"ez1@gmail.com",	 4312323,  "$2b$10$tL1XaeL0gZzTaTe.2YImD.ZjkvwnTyupM0azoZYaJ9q9Kg7VHCRP2","Tel-Aviv",	  "Avivivim 44",false),
		("Carlo","Batahat"	,"carlo_b@gmail.com",3123123,  "$2b$10$V.pcDmobvy.k.X9AWJWxGOHivJosPsCe39xY4y07sQ25M3jtRjhwG","Tel-Aviv",	  "Dizingof 23",false),
		("Carla","Bazizi"	,"carla_b@gmail.com",356465455,"$2b$10$lRhdmNTh4MpHPli3eHWqq.FrHN2QWSopZb0dioNw9So.o90.99/Hq","Beer-Sheva",	  "Habeer 32",false)		
;

create table cart_status_table(
   cart_status_id int auto_increment,
  cart_status varchar(255),
     primary key (cart_status_id)
);

 insert into cart_status_table(cart_status)
values ("Open"),("Canceled"),("Paid"),("Paid and deliverd");

create table carts_table(
  cart_id int auto_increment,
  user_id_ref int,
  cart_status_id_ref int,
  cart_created_date datetime default now(),
  order_date date,
  delivery_date date,
  total_price decimal(19,2),
  credit_card_4_last_digits int,
  delivery_city varchar(255),
  delivery_Street varchar(255),   
  primary key (cart_id),
  foreign key (user_id_ref) references users_table(user_id),
  foreign key (cart_status_id_ref) references cart_status_table(cart_status_id)
 );

insert into carts_table(user_id_ref,cart_status_id_ref,order_date,delivery_date,total_price,credit_card_4_last_digits,delivery_city,delivery_Street)
 values                 (2,          1,                 null,      null        , 4321,   	4444, 						NULL,        NULL),
						(3,          3,               '2021-08-04','2021-08-06', 2222,  	1234, 						NULL,        NULL),
						(3,          3,               '2021-08-04','2021-08-04', 323,   	3232, 						NULL,        NULL),
						(2,          3,               "2021-08-03","2021-08-05", 850,       5454,        				NULL,         NULL),
						(3,          3,               "2021-08-05","2021-08-07", 1234,      4444,      					"Tel-Aviv",   "Avivim 33"),
						(4,          3,               "2021-08-06","2021-08-07", 1234,      4444,       				"Haifa",   "Hamaapilim 3/6")
;


 create table Categories_table(
	category_id int auto_increment,
    category_name varchar(255),
    primary key (category_id)
);

 insert into Categories_table(category_name)
 values ("Frozen meats"),("Dairy products"),("Cereals"),("Pastries")
 ;

 create table products_table(
	product_id int auto_increment,
 	product_name varchar(255),
 	category_id_ref int,
 	price_in_usd decimal(19,2),
 	price_type varchar(255),
 	picture_url varchar(255),
	primary key (product_id),
 	foreign key(category_id_ref) references Categories_table(category_id)
);

 insert into products_table(product_name,category_id_ref,price_in_usd,price_type,picture_url)
 values ("Kabab",1,13.99,"Per unit","https://frozenhalal.com/wp-content/uploads/2017/05/IMG_0810.jpg")
 ;

 insert into products_table(product_name,category_id_ref,price_in_usd,price_type,picture_url)
 values ("Milk, 1 Liter in carton",		 2,6.00,"Per unit","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf-b0UY-VIqO5BEyHWrpJnIn8MyXdWkgvCTjilbCHtDKFJup9Aq0AXt6ICoLJR2diY3O8&usqp=CAU"),
		("Chocolate cereal, 750 grams",	 3, 5.21,"Per unit","https://www.dittsvenskaskafferi.com/media/catalog/product/cache/4dcb0d2f24967f7771a119ff341bc917/k/e/kelloggs-allbranregular-750g-center-front.jpg"),
		("12 Corsons Pack",				 4,7.22,"Per unit","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs3CbhdOg9jCTmPOxCFvX0eqSIm4j_yjpmr3pmDZHdoadv2V9vWN4S8mDCI1yBqC6A-e4&usqp=CAU"),
		("milkshake pack",				 2,2.99,"Per unit","https://5.imimg.com/data5/YG/XE/MY-21356805/cavins-vanilla-milkshake-500x500.jpg"),
		("Frozen chicken breast",		 1,9.50,"Per unit","https://www.thereciperebel.com/wp-content/uploads/2021/04/how-to-cook-frozen-chicken-breasts-www.thereciperebel.com-pin-2.jpg"),
		("Cheese borax",				 4,4.70,"Per unit","http://www.amit-pastry.com/images/485x355/Sep2014/big_cheese_burekas.jpg"),
		("Cheerios, honey cereal, 750 g",3,6.56,"Per unit","https://groceries.morrisons.com/productImages/542/542683011_0_640x640.jpg?identifier=4cf3a069e5f296370aaee759decb2fbd"),
		("Honey nut",					 3,7.1,"Per unit","https://d1906a8c873b5d638f11-66fd139e67371687450909048768944b.ssl.cf2.rackcdn.com/0016000124790_CR_Syndigo_default_large.png"),
        ("Frozen Stake",				 1,22.1,"Per unit","https://www.foodfirefriends.com/wp-content/uploads/2018/03/how-to-grill-frozen-steak-750x417.jpeg")
;

 create table cart_items_bridge_table(
	 cart_item_id int auto_increment,
     cart_id_ref int,
     product_id_ref int,
     quantity decimal(19,2),
     primary key (cart_item_id),
     foreign key (cart_id_ref) references carts_table(cart_id),
     foreign key (product_id_ref) references products_table(product_id)
 );

 insert into cart_items_bridge_table(cart_id_ref,product_id_ref,quantity)
 values (2,4,2),(2,5,1),(2,4,2),(2,5,1),(4,4,1),(4,2,1),(1,1,3),(1,6,2),(1,5,2),(1,2,4);

-- insert into cart_items_bridge_table(cart_id_ref,product_id_ref,quantity)
-- values (1,6,2),(1,1,3),(4,4,1),(4,2,1);







