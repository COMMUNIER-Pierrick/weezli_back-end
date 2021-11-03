INSERT INTO `transport` SET name='train', filename = 'train.png';
INSERT INTO `transport` SET name='bateau', filename='bateau.png';
INSERT INTO `transport` SET name='camion', filename = 'camion.png';
INSERT INTO `transport` SET name='bus', filename = 'bus.png';

INSERT INTO `types` SET name='expediteur';
INSERT INTO `types` SET name='transporteur';

INSERT INTO `size` SET name='petit', filename='petit.png';
INSERT INTO `size` SET name='moyen', filename='moyen.png';
INSERT INTO `size` SET name='grand', filename = 'grand.png';
INSERT INTO `size` SET name='très grand', filename='tresgrand.png';

INSERT INTO `info` SET name='depart';
INSERT INTO `info` SET name='arrival';
INSERT INTO `info` SET name='personal';

INSERT INTO `status` SET name='En cours';
INSERT INTO `status` SET name='Livré';
INSERT INTO `status` SET name='Terminé';

INSERT INTO `choice` SET name='no-formule';
INSERT INTO `choice` SET name='formule1', description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum dolor sed luctus pellentesque.', price='5', id_payment= 'price_1JlyoNKAPKSmGQtSTk8fBsqc';
INSERT INTO `choice` SET name='formule2', description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum dolor sed luctus pellentesque.', price='10', id_payment= 'price_1JmD3uKAPKSmGQtSk2yTNI1T';
INSERT INTO `choice` SET name='formule3', description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum dolor sed luctus pellentesque.', price='15', id_payment= 'price_1JmD5FKAPKSmGQtSSaxTdgme';

INSERT INTO `id_status-proposition` set name='Proposition';
INSERT INTO `id_status-proposition` set name='Contre-proposition';
INSERT INTO `id_status-proposition` set name='Validé';
INSERT INTO `id_status-proposition` set name='Refufé';


INSERT INTO `address` SET id_info=1, number=45, street='Orange St', additional_address='3eme floor', zipcode='SW1Y 4UR', city='London', country='England';
INSERT INTO `address` SET id_info=1, number=12, street='Lalana Delord', additional_address='', zipcode='105', city='Antananarivo', country='Madagascar';
INSERT INTO `address` SET id_info=2, number=28, street='Avenue des Champs-Elysées', additional_address='', zipcode='75000', city='Paris', country='France';
INSERT INTO `address` SET id_info=2, number=55, street='Liberty St', additional_address='second door', zipcode='10005', city='Manhattan New York', country='United States of America';
INSERT INTO `address` SET id_info=3, number=9, street='Rue du vin blanc', additional_address='', zipcode='44000', city='Nantes', country='France';
INSERT INTO `address` SET id_info=3, number=23, street='Chemin des vagues', additional_address='', zipcode='85000', city='Les Sables d\'Olonne', country='France';

INSERT INTO `package` SET datetime_departure=null, datetime_arrival='2021-11-28T00:00:00', kg_available=6.5, description_condition='Maecenas consectetur, magna nec pretium faucibus, ipsum urna dapibus dolor, ac ornare est purus et velit', id_transport=1;
INSERT INTO `package` SET datetime_departure=null, datetime_arrival='2021-12-21T00:00:00', kg_available=3, description_condition='Maecenas consectetur, magna nec pretium faucibus, ipsum urna dapibus dolor, ac ornare est purus et velit', id_transport=1;
INSERT INTO `package` SET datetime_departure=null, datetime_arrival='2021-10-15T00:00:00.', kg_available=15, description_condition='Maecenas consectetur, magna nec pretium faucibus, ipsum urna dapibus dolor, ac ornare est purus et velit', id_transport=1;
INSERT INTO `package` SET datetime_departure='2021-11-26T00:00:00', datetime_arrival='2021-11-29T00:00:00', kg_available=7, description_condition='', id_transport='2';
INSERT INTO `package` SET datetime_departure='2021-12-20T00:00:00', datetime_arrival='2021-12-22T00:00:00', kg_available=4, description_condition='', id_transport='3';
INSERT INTO `package` SET datetime_departure='2021-10-15T00:00:00', datetime_arrival='2021-10-15T00:00:00', kg_available=20, description_condition='', id_transport='4';

INSERT INTO `payment` SET name='alain terieur', iban='FR0000000000000000000000001', number_card='5698524587459685' , expired_date_card='2022-12-10T00:00:00';
INSERT INTO `payment` SET name='sarah croche', iban='FR0000000000000000000000002', number_card='5245874596855698' , expired_date_card='2023-12-10T00:00:00';
INSERT INTO `payment` SET name='marc assin', iban='FR0000000000000000000000003', number_card='8745968556985245' , expired_date_card='2024-12-10T00:00:00';

INSERT INTO `check_user` SET status_phone=true, status_mail=false, status_identity=true, img_identity=null, status='Active', confirm_code = '56dxf46x5df4g6dwf5g46sd5fg4dw6f';
INSERT INTO `check_user` SET status_phone=false, status_mail=true, status_identity=true, img_identity='pictureidentity1.jpg', status='Active', confirm_code = 'df6g5h4xfdg65h4xf6g5hf';
INSERT INTO `check_user` SET status_phone=false, status_mail=false, status_identity=false, img_identity='', status='Pending', confirm_code = 's6d5fg4hw6dfg4sdfh5fg45h';


INSERT INTO `users` SET firstname='alain',lastname='terrieur', username='alainterieur', password='1§fdv54ùmsldc354sdvm^$5656m',
                        email='alain@terrieur.com', phone='0707070707', date_of_birthday= '2000-12-10T00:00:00', active=1, url_profile_img='', average_opinion=4.5,
                        id_payment=1, id_choice=1, id_check=1, choice_date_started = '2021-12-10T00:00:00', choice_date_end= '2021-12-10T00:00:00', id_address = 3;

INSERT INTO `users` SET firstname='sarah',lastname='croche', username='sarahcroche', password='1§fdv54ùmsldc354sdvm^$5656m',
                        email='sarah@croche.com', phone='0606060606', date_of_birthday= '1989-12-10T00:00:00', active=1, url_profile_img='pictureprofile2.png', average_opinion=2.5,
                        id_payment=2, id_choice=3, id_check=2, choice_date_started = '2021-11-10T00:00:00', choice_date_end= '2021-12-10T00:00:00', id_address= 5;

INSERT INTO `users` SET firstname='marc',lastname='assin', username='marcassin', password='1§fdv54ùmsldc354sdvm^$5656m',
                        email='marc@assin.com', phone='0607070707', date_of_birthday= '1989-12-10T00:00:00', active=1, url_profile_img='pictureprofile3.png', average_opinion=0,
                        id_payment=3, id_choice=2, id_check=3, choice_date_started = '2021-11-10T00:00:00', choice_date_end= '2022-03-10T00:00:00', id_address= 6;


INSERT INTO `rel_package_sizes` SET id_package=1, id_size=2;
INSERT INTO `rel_package_sizes` SET id_package=1, id_size=3;
INSERT INTO `rel_package_sizes` SET id_package=2, id_size=1;
INSERT INTO `rel_package_sizes` SET id_package=3, id_size=3;
INSERT INTO `rel_package_sizes` SET id_package=3, id_size=4;
INSERT INTO `rel_package_sizes` SET id_package=4, id_size=3;
INSERT INTO `rel_package_sizes` SET id_package=4, id_size=4;
INSERT INTO `rel_package_sizes` SET id_package=5, id_size=2;
INSERT INTO `rel_package_sizes` SET id_package=6, id_size=1;
INSERT INTO `rel_package_sizes` SET id_package=6, id_size=2;
INSERT INTO `rel_package_sizes` SET id_package=6, id_size=3;
INSERT INTO `rel_package_sizes` SET id_package=6, id_size=4;

INSERT INTO `rel_package_address` SET id_package=1, id_address=1;
INSERT INTO `rel_package_address` SET id_package=1, id_address=3;
INSERT INTO `rel_package_address` SET id_package=2, id_address=2;
INSERT INTO `rel_package_address` SET id_package=2, id_address=4;
INSERT INTO `rel_package_address` SET id_package=3, id_address=2;
INSERT INTO `rel_package_address` SET id_package=3, id_address=3;
INSERT INTO `rel_package_address` SET id_package=4, id_address=1;
INSERT INTO `rel_package_address` SET id_package=4, id_address=4;
INSERT INTO `rel_package_address` SET id_package=5, id_address=2;
INSERT INTO `rel_package_address` SET id_package=5, id_address=4;
INSERT INTO `rel_package_address` SET id_package=6, id_address=1;
INSERT INTO `rel_package_address` SET id_package=6, id_address=3;

INSERT INTO `announce` SET id_package=1, views=10, id_type=1, price=12.5, img_url='picture15052021.png, picture15052021.png', date_created='2021-11-01T00:00:00';
INSERT INTO `announce` SET id_package=2, views=0, id_type=1, price=15, img_url='', date_created='2021-12-10T00:00:00';
INSERT INTO `announce` SET id_package=3, views=3, id_type=1, price=59, img_url='picture15052021.png', date_created='2021-10-05T00:00:00';
INSERT INTO `announce` SET id_package=4, views=8, id_type=2, price=28.50, img_url='', date_created='2021-10-01T00:00:00';
INSERT INTO `announce` SET id_package=5, views=1, id_type=2, price=5, img_url='', date_created='2021-11-10T00:00:00';
INSERT INTO `announce` SET id_package=6, views=0, id_type=2, price=125.90, img_url='', date_created='2021-09-05T00:00:00';

INSERT INTO `orders` SET code_validated = '51358', id_status = 1, id_announce = 1, date_order = '2021-12-10T00:00:00';
INSERT INTO `orders` SET code_validated = '55358', id_status = 2, id_announce = 2, date_order = '2021-12-10T00:00:00';
INSERT INTO `orders` SET code_validated = '48138', id_status = 3, id_announce = 3, date_order = '2021-12-10T00:00:00';

INSERT INTO `rel_user_announce` SET id_user=1, id_announce=1;
INSERT INTO `rel_user_announce` SET id_user=1, id_announce=4;
INSERT INTO `rel_user_announce` SET id_user=2, id_announce=2;
INSERT INTO `rel_user_announce` SET id_user=2, id_announce=5;
INSERT INTO `rel_user_announce` SET id_user=3, id_announce=3;
INSERT INTO `rel_user_announce` SET id_user=3, id_announce=6;

INSERT INTO `proposition` SET id_announce = 1, id_user = 2, proposition = 10, `id_status-proposition` = 1;
INSERT INTO `proposition` SET id_announce = 2, id_user = 3, proposition = 12, `id_status-proposition` = 2;
INSERT INTO `proposition` SET id_announce = 3, id_user = 1, proposition = 45, `id_status-proposition` = 3;
INSERT INTO `proposition` SET id_announce = 4, id_user = 2, proposition = 35, `id_status-proposition` = 4;
INSERT INTO `proposition` SET id_announce = 5, id_user = 3, proposition = 15, `id_status-proposition` = 1;
INSERT INTO `proposition` SET id_announce = 6, id_user = 1, proposition = 100, `id_status-proposition` = 2;

INSERT INTO `proposition` SET id_announce = 1, id_user = 3, proposition = 5, `id_status-proposition` = 4;
INSERT INTO `proposition` SET id_announce = 2, id_user = 1, proposition = 15, `id_status-proposition` = 3;
INSERT INTO `proposition` SET id_announce = 3, id_user = 2, proposition = 50, `id_status-proposition` = 2;
INSERT INTO `proposition` SET id_announce = 4, id_user = 3, proposition = 20, `id_status-proposition` = 1;
INSERT INTO `proposition` SET id_announce = 5, id_user = 1, proposition = 10, `id_status-proposition` = 1;
INSERT INTO `proposition` SET id_announce = 6, id_user = 2, proposition = 75, `id_status-proposition` = 1;
