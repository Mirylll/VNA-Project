--
-- PostgreSQL database dump
--

\restrict tZouj517lhzt2bpcVEOU6cFvdbcF0u2gsa4YIgzypD02KPV68KXpgMdr7MQig7w

-- Dumped from database version 15.18 (Debian 15.18-1.pgdg13+1)
-- Dumped by pg_dump version 15.18 (Debian 15.18-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: vna_user
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.provinces DISABLE TRIGGER ALL;

INSERT INTO public.provinces (id, name) VALUES (1, 'Thành phố Hồ Chí Minh');


ALTER TABLE public.provinces ENABLE TRIGGER ALL;

--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.districts DISABLE TRIGGER ALL;

INSERT INTO public.districts (id, name, province_id) VALUES (1, 'Bến Thành', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (2, 'Bàn Cờ', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (3, 'Xuân Hòa', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (4, 'Khánh Hội', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (5, 'An Đông', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (6, 'Bình Phú', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (7, 'Bình Tây', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (8, 'Tân Thuận Đông', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (9, 'Bình Đông', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (10, 'Tân Thới Nhất', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (11, 'An Phú Đông', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (12, 'An Lạc', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (13, 'Bình Tân', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (14, 'Bình Hưng Hòa', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (15, 'Bình Quới', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (16, 'Bình Lợi Trung', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (17, 'An Nhơn', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (18, 'An Hội Tây', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (19, 'Bảy Hiền', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (20, 'An Khánh', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (21, 'Bình Hưng', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (22, 'Vĩnh Lộc A', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (23, 'Vĩnh Lộc B', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (24, 'Lê Minh Xuân', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (25, 'Tân Kiên', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (26, 'Phước Kiển', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (27, 'Phú Xuân', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (28, 'Nhơn Đức', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (29, 'Tân Thới Nhì', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (30, 'An Phú', 1);


ALTER TABLE public.districts ENABLE TRIGGER ALL;

--
-- Data for Name: enterprise_types; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.enterprise_types DISABLE TRIGGER ALL;

INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (1, 'CP', 'Công ty cổ phần', NULL, true, '2026-06-11 08:32:00.846753', '2026-06-11 08:32:00.846753');
INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (2, 'TNHH', 'Công ty TNHH', NULL, true, '2026-06-11 08:32:00.850889', '2026-06-11 08:32:00.850889');
INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (3, 'TNHH1TV', 'Công ty TNHH 1 thành viên', NULL, true, '2026-06-11 08:32:00.853615', '2026-06-11 08:32:00.853615');
INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (4, 'DNTN', 'Doanh nghiệp tư nhân', NULL, true, '2026-06-11 08:32:00.856372', '2026-06-11 08:32:00.856372');
INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (7, 'HTX', 'Hợp tác xã', NULL, true, '2026-06-11 08:32:00.866208', '2026-06-11 13:22:17.622965');
INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (5, 'DNNN', 'Doanh nghiệp nhà nước', NULL, true, '2026-06-11 08:32:00.858735', '2026-06-11 13:22:41.003475');
INSERT INTO public.enterprise_types (id, code, name, description, is_active, created_at, updated_at) VALUES (6, 'HKD', 'Hộ kinh doanh', NULL, true, '2026-06-11 08:32:00.863614', '2026-06-11 13:22:41.536973');


ALTER TABLE public.enterprise_types ENABLE TRIGGER ALL;

--
-- Data for Name: industries; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.industries DISABLE TRIGGER ALL;

INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (58, 'LV1-1', 'Nông nghiệp, lâm nghiệp và thủy sản', 1, true, '2026-06-12 04:37:42.140875', '2026-06-12 04:37:42.140875', NULL);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (59, 'LV1-2', 'Công nghiệp khai khoáng', 1, true, '2026-06-12 04:37:42.140875', '2026-06-12 04:37:42.140875', NULL);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (60, 'LV1-3', 'Công nghiệp chế biến, chế tạo', 1, true, '2026-06-12 04:37:42.140875', '2026-06-12 04:37:42.140875', NULL);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (61, 'LV1-4', 'Thương mại và dịch vụ', 1, true, '2026-06-12 04:37:42.140875', '2026-06-12 04:37:42.140875', NULL);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (62, 'LV2-1', 'Trồng trọt và chăn nuôi', 2, true, '2026-06-12 04:37:42.151232', '2026-06-12 04:37:42.151232', 58);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (63, 'LV2-2', 'Khai thác dầu thô và khí đốt', 2, true, '2026-06-12 04:37:42.151232', '2026-06-12 04:37:42.151232', 59);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (64, 'LV2-3', 'Sản xuất thực phẩm và đồ uống', 2, true, '2026-06-12 04:37:42.151232', '2026-06-12 04:37:42.151232', 60);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (65, 'LV2-4', 'Dệt may và da giày', 2, true, '2026-06-12 04:37:42.151232', '2026-06-12 04:37:42.151232', 60);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (66, 'LV2-5', 'Bán buôn và bán lẻ', 2, true, '2026-06-12 04:37:42.151232', '2026-06-12 04:37:42.151232', 61);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (67, 'LV3-1', 'Trồng cây hàng năm', 3, true, '2026-06-12 04:37:42.154897', '2026-06-12 04:37:42.154897', 62);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (68, 'LV3-2', 'Chăn nuôi gia súc, gia cầm', 3, true, '2026-06-12 04:37:42.154897', '2026-06-12 04:37:42.154897', 62);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (69, 'LV3-3', 'Chế biến và bảo quản thủy sản', 3, true, '2026-06-12 04:37:42.154897', '2026-06-12 04:37:42.154897', 64);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (70, 'LV3-4', 'Sản xuất đồ uống không cồn', 3, true, '2026-06-12 04:37:42.154897', '2026-06-12 04:37:42.154897', 64);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (71, 'LV3-5', 'May trang phục', 3, true, '2026-06-12 04:37:42.154897', '2026-06-12 04:37:42.154897', 65);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (72, 'LV3-6', 'Siêu thị và cửa hàng tiện lợi', 3, true, '2026-06-12 04:37:42.154897', '2026-06-12 04:37:42.154897', 66);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (74, 'LV4-2', 'Trồng rau, củ, quả', 4, true, '2026-06-12 04:37:42.158887', '2026-06-12 04:37:42.158887', 67);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (75, 'LV4-3', 'Chế biến cá tra, cá basa', 4, true, '2026-06-12 04:37:42.158887', '2026-06-12 04:37:42.158887', 69);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (76, 'LV4-4', 'Sản xuất nước giải khát', 4, true, '2026-06-12 04:37:42.158887', '2026-06-12 04:37:42.158887', 70);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (77, 'LV4-5', 'May áo sơ mi, veston', 4, true, '2026-06-12 04:37:42.158887', '2026-06-12 04:37:42.158887', 71);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (73, 'LV4-1', 'Trồng lúa', 4, false, '2026-06-12 04:37:42.158887', '2026-06-12 04:38:40.108388', 67);


ALTER TABLE public.industries ENABLE TRIGGER ALL;

--
-- Data for Name: enterprises; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.enterprises DISABLE TRIGGER ALL;

INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (12, 'Công ty TNHH Thương mại ABC', '910000888295', NULL, '45 Lý Tự Trọng, Quận 1', NULL, 'abc@thuongmai.vn', '02838282891', NULL, NULL, NULL, '910000888295', '12345678', true, '2026-06-12 05:15:18.271579', '2026-06-12 05:15:18.271579', 2, 73, 1, 1, NULL, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (13, 'Công ty CP Đầu tư Bình Minh', '910000888296', NULL, '88 Nguyễn Đình Chiểu, Quận 3', NULL, 'info@binhminh.vn', '02838282892', NULL, NULL, NULL, '910000888296', '12345678', true, '2026-06-12 05:15:18.271579', '2026-06-12 05:15:18.271579', 1, 74, 1, 2, NULL, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (14, 'Doanh nghiệp tư nhân Hoàng Anh', '910000888297', NULL, '12 Pasteur, Quận 1', NULL, 'hoanganh@dntn.vn', '02838282893', NULL, NULL, NULL, '910000888297', 'HoangAnh@2024', true, '2026-06-12 05:15:18.271579', '2026-06-12 05:15:18.271579', 4, 75, 1, 3, NULL, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (15, 'Công ty TNHH Sản xuất Thực phẩm Xanh', '910000888298', NULL, '67 Võ Văn Tần, Quận 3', NULL, 'xanh@thucpham.vn', '02838282894', NULL, NULL, NULL, '910000888298', 'Xanh@123', true, '2026-06-12 05:15:18.271579', '2026-06-12 05:15:18.271579', 2, 76, 1, 4, NULL, NULL);


ALTER TABLE public.enterprises ENABLE TRIGGER ALL;

--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.attachments DISABLE TRIGGER ALL;



ALTER TABLE public.attachments ENABLE TRIGGER ALL;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.roles DISABLE TRIGGER ALL;

INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (1, 'ADMIN', 'Quản trị viên', '2026-06-11 08:32:00.586972', '2026-06-11 08:32:00.586972');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (2, 'MANAGER', 'Manager', '2026-06-11 08:32:00.591706', '2026-06-11 08:32:00.591706');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (3, 'EMPLOYEE', 'Employee', '2026-06-11 08:32:00.594037', '2026-06-11 08:32:00.594037');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (4, 'CEO', 'CEO', '2026-06-11 08:32:00.598169', '2026-06-11 08:32:00.598169');


ALTER TABLE public.roles ENABLE TRIGGER ALL;

--
-- Data for Name: titles; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.titles DISABLE TRIGGER ALL;

INSERT INTO public.titles (id, name, created_at) VALUES (1, 'Giám đốc', '2026-06-11 08:32:00.570523');
INSERT INTO public.titles (id, name, created_at) VALUES (2, 'Trưởng phòng', '2026-06-11 08:32:00.57318');
INSERT INTO public.titles (id, name, created_at) VALUES (3, 'Nhân viên', '2026-06-11 08:32:00.575731');
INSERT INTO public.titles (id, name, created_at) VALUES (4, 'Kế toán', '2026-06-11 08:32:00.577966');
INSERT INTO public.titles (id, name, created_at) VALUES (5, 'Quản trị viên', '2026-06-11 08:32:00.579934');


ALTER TABLE public.titles ENABLE TRIGGER ALL;

--
-- Data for Name: user_avatars; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.user_avatars DISABLE TRIGGER ALL;

INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (1, '1781168998598-kitty.jpg', 'uploads/avatars/ba4f41b1-3531-4d7b-bae4-6db019b97b4d/1781168998598-kitty.jpg', 43489, 'image/jpeg', '2026-06-11 09:09:58.603434', 'ba4f41b1-3531-4d7b-bae4-6db019b97b4d');
INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (2, '1781169008966-catt.jpg', 'uploads/avatars/244a4bb8-61fc-4994-8575-585fa235454d/1781169008966-catt.jpg', 27885, 'image/jpeg', '2026-06-11 09:10:08.970518', '244a4bb8-61fc-4994-8575-585fa235454d');
INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (3, '1781171282463-catt.jpg', 'uploads/avatars/14cf1098-544d-4ea0-ace9-7b3e2c20fd9f/1781171282463-catt.jpg', 27885, 'image/jpeg', '2026-06-11 09:48:02.469189', '14cf1098-544d-4ea0-ace9-7b3e2c20fd9f');
INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (4, '1781171298548-444.jpg', 'uploads/avatars/2845b57a-16bb-479d-bc16-9e4a1f1d0a44/1781171298548-444.jpg', 495215, 'image/jpeg', '2026-06-11 09:48:18.563187', '2845b57a-16bb-479d-bc16-9e4a1f1d0a44');


ALTER TABLE public.user_avatars ENABLE TRIGGER ALL;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('244a4bb8-61fc-4994-8575-585fa235454d', 'banbanban', '$2b$10$dGQG58n0bweIMP3gJUp/4uWjWMspzLrtX.iSuIW5KRdbWil376Tsq', 'Võ Kim Bằng', 'vokimbang@gmail.com', '2004-10-22', 'Nam', '/uploads/avatars/244a4bb8-61fc-4994-8575-585fa235454d/1781169008966-catt.jpg', '241 Hùng Vương', true, '2026-06-11 09:09:43.944026', '2026-06-11 09:10:10.057904', NULL, 3, 3, 1, NULL, 2);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('ba4f41b1-3531-4d7b-bae4-6db019b97b4d', 'admin', '$2b$10$/6Nl9tJdgXWi12i5f./KluVFM39S3OlT.Y57x2sG1zSmfCRlkxFwC', 'Administrator', 'ducdung.learn2103@gmail.com', NULL, 'Nam', '/uploads/avatars/ba4f41b1-3531-4d7b-bae4-6db019b97b4d/1781168998598-kitty.jpg', NULL, true, '2026-06-11 08:32:00.692727', '2026-06-11 09:09:59.820191', NULL, 4, 1, 1, NULL, 1);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('14cf1098-544d-4ea0-ace9-7b3e2c20fd9f', 'ducduc', '$2b$10$ANzfUuy.kbjiiSlHf.94d.qPAvZwVbSL/vMseHQyr5Qv5PTirciEa', 'Võ Văn Đức', '3122410015@sv.sgu.edu.vn', '2004-02-01', 'Nam', '/uploads/avatars/14cf1098-544d-4ea0-ace9-7b3e2c20fd9f/1781171282463-catt.jpg', '333 Trần Phú', true, '2026-06-11 09:48:02.396798', '2026-06-11 12:51:54.671478', NULL, 2, 4, 1, 15, 3);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('2845b57a-16bb-479d-bc16-9e4a1f1d0a44', 'baobao', '$2b$10$6sASgAFIwfW4iz9WjrwmvOslgiUWS.reQYuWifcskSvSAHnPg68Fe', 'Hà Ngọc Thiên Bảo', 'hntb0102@gmail.com', '2004-02-01', 'Nam', '/uploads/avatars/2845b57a-16bb-479d-bc16-9e4a1f1d0a44/1781171298548-444.jpg', '77/20 An Dương Vương', true, '2026-06-11 09:28:52.301956', '2026-06-11 12:51:56.093809', NULL, 4, 1, 1, 1, 4);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('42414bfc-a2cd-4506-b985-96de495540dd', '910000888295', '$2b$10$5xOpV2wRsUqMmh7YAFE6WeQo1P38THhIPAOu47ZuXitek4NttmwW2', 'Công ty TNHH Thương mại ABC', 'abc@thuongmai.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('195ac07a-c1e1-4c05-948f-008729942c42', '910000888296', '$2b$10$5xOpV2wRsUqMmh7YAFE6WeQo1P38THhIPAOu47ZuXitek4NttmwW2', 'Công ty CP Đầu tư Bình Minh', 'info@binhminh.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('245ddcf4-5ff8-4ae4-84d5-9f645a63d694', '910000888297', '$2b$10$Lrb3epfsj/DdBwnvae0DXe8ePRGR6cfoSptkIDAWLWdv/TARlzNKW', 'Doanh nghiệp tư nhân Hoàng Anh', 'hoanganh@dntn.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id) VALUES ('09b5659d-7c11-4644-a3ac-9401d15bec0b', '910000888298', '$2b$10$sKqSfqQIRvVUF.BE4H83yuiv/F2UPo86zUAySDTtLl2xx141nd5Py', 'Công ty TNHH Sản xuất Thực phẩm Xanh', 'xanh@thucpham.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, NULL, NULL, NULL, NULL, NULL);


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.otp_codes DISABLE TRIGGER ALL;



ALTER TABLE public.otp_codes ENABLE TRIGGER ALL;

--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.permissions DISABLE TRIGGER ALL;

INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (1, 'ADMIN_G_DEPARTMENT', 'Department Group', 'Group', 0, '2026-06-11 08:32:00.446631', '2026-06-11 08:32:00.446631', NULL);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (2, 'ADMIN_C_DEPARTMENT_VIEW', 'View Department', 'Component', 0, '2026-06-11 08:32:00.482791', '2026-06-11 08:32:00.482791', 1);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (3, 'ADMIN_C_DEPARTMENT_CREATE', 'Create Department', 'Component', 1, '2026-06-11 08:32:00.489335', '2026-06-11 08:32:00.489335', 1);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (4, 'ADMIN_C_DEPARTMENT_UPDATE', 'Update Department', 'Component', 2, '2026-06-11 08:32:00.494311', '2026-06-11 08:32:00.494311', 1);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (5, 'ADMIN_C_DEPARTMENT_DELETE', 'Delete Department', 'Component', 3, '2026-06-11 08:32:00.499994', '2026-06-11 08:32:00.499994', 1);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (6, 'ADMIN_G_ROLE', 'Role Group', 'Group', 1, '2026-06-11 08:32:00.504304', '2026-06-11 08:32:00.504304', NULL);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (7, 'ADMIN_C_ROLE_VIEW', 'View Role', 'Component', 0, '2026-06-11 08:32:00.508943', '2026-06-11 08:32:00.508943', 6);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (8, 'ADMIN_C_ROLE_CREATE', 'Create Role', 'Component', 1, '2026-06-11 08:32:00.511911', '2026-06-11 08:32:00.511911', 6);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (9, 'ADMIN_C_ROLE_UPDATE', 'Update Role', 'Component', 2, '2026-06-11 08:32:00.517131', '2026-06-11 08:32:00.517131', 6);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (10, 'ADMIN_C_ROLE_DELETE', 'Delete Role', 'Component', 3, '2026-06-11 08:32:00.525745', '2026-06-11 08:32:00.525745', 6);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (11, 'ADMIN_G_USER', 'User Group', 'Group', 2, '2026-06-11 08:32:00.536527', '2026-06-11 08:32:00.536527', NULL);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (12, 'ADMIN_C_USER_VIEW', 'View User', 'Component', 0, '2026-06-11 08:32:00.54042', '2026-06-11 08:32:00.54042', 11);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (13, 'ADMIN_C_USER_CREATE', 'Create User', 'Component', 1, '2026-06-11 08:32:00.543816', '2026-06-11 08:32:00.543816', 11);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (14, 'ADMIN_C_USER_UPDATE', 'Update User', 'Component', 2, '2026-06-11 08:32:00.547401', '2026-06-11 08:32:00.547401', 11);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (15, 'ADMIN_C_USER_DELETE', 'Delete User', 'Component', 3, '2026-06-11 08:32:00.551879', '2026-06-11 08:32:00.551879', 11);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (16, 'ADMIN_G_PERMISSION', 'Permission Group', 'Group', 3, '2026-06-11 08:32:00.555354', '2026-06-11 08:32:00.555354', NULL);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (17, 'ADMIN_C_PERMISSION_VIEW', 'View Permission', 'Component', 0, '2026-06-11 08:32:00.557855', '2026-06-11 08:32:00.557855', 16);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (18, 'ADMIN_C_PERMISSION_ASSIGN', 'Assign Permission', 'Component', 1, '2026-06-11 08:32:00.560092', '2026-06-11 08:32:00.560092', 16);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (19, 'ADMIN_G_REPORT', 'Report Group', 'Group', 4, '2026-06-11 08:32:00.562953', '2026-06-11 08:32:00.562953', NULL);
INSERT INTO public.permissions (id, code, name, type, sort_order, created_at, updated_at, parent_id) VALUES (20, 'ADMIN_C_REPORT_VIEW', 'View Report', 'Component', 0, '2026-06-11 08:32:00.565188', '2026-06-11 08:32:00.565188', 19);


ALTER TABLE public.permissions ENABLE TRIGGER ALL;

--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.refresh_tokens DISABLE TRIGGER ALL;



ALTER TABLE public.refresh_tokens ENABLE TRIGGER ALL;

--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.role_permissions DISABLE TRIGGER ALL;

INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 2);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 3);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 4);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 5);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 7);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 8);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 9);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 10);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 12);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 13);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 14);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 15);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 17);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 18);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 20);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 2);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 3);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 4);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 7);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 8);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 9);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 12);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 13);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 14);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 17);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 18);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (2, 20);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (3, 2);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (3, 7);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (3, 12);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (3, 17);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (3, 20);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 2);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 3);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 4);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 5);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 7);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 8);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 9);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 10);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 12);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 13);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 14);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 15);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 17);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 18);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 20);


ALTER TABLE public.role_permissions ENABLE TRIGGER ALL;

--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.attachments_id_seq', 3, true);


--
-- Name: districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.districts_id_seq', 30, true);


--
-- Name: enterprise_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.enterprise_types_id_seq', 9, true);


--
-- Name: enterprises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.enterprises_id_seq', 15, true);


--
-- Name: industries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.industries_id_seq', 77, true);


--
-- Name: otp_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.otp_codes_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.permissions_id_seq', 20, true);


--
-- Name: provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.provinces_id_seq', 1, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: titles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.titles_id_seq', 5, true);


--
-- Name: user_avatars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.user_avatars_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict tZouj517lhzt2bpcVEOU6cFvdbcF0u2gsa4YIgzypD02KPV68KXpgMdr7MQig7w

