INSERT INTO `transport` SET name='non-identifier';
INSERT INTO `transport` SET name='avion';
INSERT INTO `transport` SET name='voiture';
INSERT INTO `transport` SET name='train';
INSERT INTO `transport` SET name='bateau';

INSERT INTO `types` SET name='expediteur';
INSERT INTO `types` SET name='transporteur';

INSERT INTO `size` SET name='petit';
INSERT INTO `size` SET name='moyen';
INSERT INTO `size` SET name='grand';
INSERT INTO `size` SET name='très grand';

INSERT INTO `info` SET name='depart';
INSERT INTO `info` SET name='arrival';

INSERT INTO `choice` SET name='formule1', description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum dolor sed luctus pellentesque.', price='5.5';
INSERT INTO `choice` SET name='formule2', description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum dolor sed luctus pellentesque.', price='10';
INSERT INTO `choice` SET name='formule3', description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum dolor sed luctus pellentesque.', price='14.9';

INSERT INTO `rib` SET name='alain terieur', iban='FR0000000000000000000000001';
INSERT INTO `rib` SET name='alex terieur', iban='FR0000000000000000000000002';

INSERT INTO `check_user` SET status_phone=true, status_mail=false, status_identity=true, img_identity=null;
INSERT INTO `check_user` SET status_phone=false, status_mail=true, status_identity=true, img_identity='pictureidentity1.jpg';

INSERT INTO `users` SET firstname='alain',lastname='terrieur', username='alainterieur', password='1§fdv54ùmsldc354sdvm^$5656m',
                        email='alain@terrieur.com', phone='0707070707', active=1, url_profile_img='', average_opinion=4.5,
                        id_rib=1, id_choice=1, id_check=1;

INSERT INTO `users` SET firstname='sarah',lastname='croche', username='sarahcroche', password='1§fdv54ùmsldc354sdvm^$5656m',
                        email='sarah@croche.com', phone='0606060606', active=1, url_profile_img='pictureprofile2.png', average_opinion=2.5,
                        id_rib=2, id_choice=3, id_check=2;

