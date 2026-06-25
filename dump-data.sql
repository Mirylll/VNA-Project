--
-- PostgreSQL database dump
--

\restrict Wz80vv8xXFtdC5jG3Y3nHsTV2DNjsvUNTn422MKQKzTehltOeUOO5YuOeOrWEug

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

INSERT INTO public.districts (id, name, province_id) VALUES (61, 'Phường Sài Gòn (Quận 1)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (62, 'Phường Tân Định (Quận 1)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (63, 'Phường Bến Thành (Quận 1)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (64, 'Phường Cầu Ông Lãnh (Quận 1)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (65, 'Phường Bàn Cờ (Quận 3)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (66, 'Phường Xuân Hòa (Quận 3)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (67, 'Phường Nhiêu Lộc (Quận 3)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (68, 'Phường Xóm Chiếu (Quận 4)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (69, 'Phường Khánh Hội (Quận 4)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (70, 'Phường Vĩnh Hội (Quận 4)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (71, 'Phường Chợ Quán (Quận 5)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (72, 'Phường An Đông (Quận 5)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (73, 'Phường Chợ Lớn (Quận 5)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (74, 'Phường Bình Tây (Quận 6)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (75, 'Phường Bình Tiên (Quận 6)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (76, 'Phường Bình Phú (Quận 6)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (77, 'Phường Phú Lâm (Quận 6)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (78, 'Phường Tân Thuận (Quận 7)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (79, 'Phường Phú Thuận (Quận 7)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (80, 'Phường Tân Mỹ (Quận 7)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (81, 'Phường Tân Hưng (Quận 7)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (82, 'Phường Chánh Hưng (Quận 8)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (83, 'Phường Phú Định (Q.8)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (84, 'Phường Bình Đông (Q.8)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (85, 'Phường Diên Hồng (Quận 10)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (86, 'Phường Vườn Lài (Quận 10)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (87, 'Phường Hòa Hưng (Quận 10)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (88, 'Phường Minh Phụng (Quận 11)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (89, 'Phường Bình Thới (Quận 11)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (90, 'Phường Hòa Bình (Quận 11)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (91, 'Phường Phú Thọ (Quận 11)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (92, 'Phường Đông Hưng Thuận (Quận 12)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (93, 'Phường Trung Mỹ Tây (Quận 12)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (94, 'Phường Tân Thới Hiệp (Quận 12)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (95, 'Phường Thới An (Quận 12)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (96, 'Phường An Phú Đông (Quận 12)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (97, 'Phường An Lạc (Quận Bình Tân)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (98, 'Phường Bình Tân (Quận Bình Tân)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (99, 'Phường Tân Tạo (Quận Bình Tân)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (100, 'Phường Bình Trị Đông (Quận Bình Tân)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (101, 'Phường Bình Hưng Hòa (Quận Bình Tân)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (102, 'Phường Gia Định (Quận Bình Thạnh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (103, 'Phường Bình Thạnh (Quận Bình Thạnh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (104, 'Phường Bình Lợi Trung (Quận Bình Thạnh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (105, 'Phường Thạnh Mỹ Tây (Quận Bình Thạnh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (106, 'Phường Bình Quới (Quận Bình Thạnh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (107, 'Phường Hạnh Thông (Quận Gò Vấp)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (108, 'Phường An Nhơn (Quận Gò Vấp)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (109, 'Phường Gò Vấp (Quận Gò Vấp)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (110, 'Phường An Hội Đông (Quận Gò Vấp)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (111, 'Phường Thông Tây Hội (Quận Gò Vấp)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (112, 'Phường An Hội Tây (Quận Gò Vấp)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (113, 'Phường Đức Nhuận (Quận Phú Nhuận)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (114, 'Phường Cầu Kiệu (Quận Phú Nhuận)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (115, 'Phường Phú Nhuận (Quận Phú Nhuận)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (116, 'Phường Tân Sơn Hòa (Quận Tân Bình)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (117, 'Phường Tân Sơn Nhất (Quận Tân Bình)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (118, 'Phường Tân Hòa (Quận Tân Bình)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (119, 'Phường Bảy Hiền (Quận Tân Bình)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (120, 'Phường Tân Bình (Quận Tân Bình)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (121, 'Phường Tân Sơn (Quận Tân Bình)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (122, 'Phường Tây Thạnh (Quận Tân Phú)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (123, 'Phường Tân Sơn Nhì (Quận Tân Phú)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (124, 'Phường Phú Thọ Hòa (Quận Tân Phú)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (125, 'Phường Tân Phú (Quận Tân Phú)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (126, 'Phường Phú Thạnh (Quận Tân Phú)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (127, 'Phường Hiệp Bình (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (128, 'Phường Thủ Đức (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (129, 'Phường Tam Bình (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (130, 'Phường Linh Xuân (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (131, 'Phường Tăng Nhơn Phú (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (132, 'Phường Long Bình (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (133, 'Phường Long Phước (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (134, 'Phường Long Trường (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (135, 'Phường Cát Lái (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (136, 'Phường Bình Trưng (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (137, 'Phường Phước Long (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (138, 'Phường An Khánh (TP. Thủ Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (139, 'Phường Đông Hòa (TP. Dĩ An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (140, 'Phường Dĩ An (TP. Dĩ An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (141, 'Phường Tân Đông Hiệp (TP. Dĩ An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (142, 'Phường An Phú (TP. Thuận An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (143, 'Phường Bình Hòa (TP. Thuận An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (144, 'Phường Lái Thiêu (TP. Thuận An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (145, 'Phường Thuận An (TP. Thuận An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (146, 'Phường Thuận Giao (TP. Thuận An)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (147, 'Phường Thủ Dầu Một (TP. Thủ Dầu Một)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (148, 'Phường Phú Lợi (TP. Thủ Dầu Một)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (149, 'Phường Chánh Hiệp (TP. Thủ Dầu Một)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (150, 'Phường Bình Dương (TP. TDM)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (151, 'Phường Hòa Lợi (TP. Bến Cát)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (152, 'Phường Phú An (TP. Thủ Dầu Một)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (153, 'Phường Tây Nam (TP. Bến Cát)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (154, 'Phường Long Nguyên (TP. Bến Cát)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (155, 'Phường Bến Cát (TP. Bến Cát)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (156, 'Phường Chánh Phú Hòa (TP. Bến Cát)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (157, 'Phường Vĩnh Tân (TP. Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (158, 'Phường Bình Cơ (TP. Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (159, 'Phường Tân Uyên (TP. Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (160, 'Phường Tân Hiệp (TP. Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (161, 'Phường Tân Khánh (TP. Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (162, 'Phường Vũng Tàu (TP. Vũng Tàu)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (163, 'Phường Tam Thắng (TP. Vũng Tàu)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (164, 'Phường Rạch Dừa (TP. Vũng Tàu)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (165, 'Phường Phước Thắng (TP. Vũng Tàu)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (166, 'Phường Long Hương (TP. Bà Rịa)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (167, 'Phường Bà Rịa (TP. Bà Rịa)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (168, 'Phường Tam Long (TP. Bà Rịa)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (169, 'Phường Tân Hải (TP. Phú Mỹ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (170, 'Phường Tân Phước (TP. Phú Mỹ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (171, 'Phường Phú Mỹ (TP. Phú Mỹ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (172, 'Phường Tân Thành (TP. Phú Mỹ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (173, 'Xã Vĩnh Lộc (Huyện Bình Chánh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (174, 'Xã Tân Vĩnh Lộc (Huyện Bình Chánh..)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (175, 'Xã Bình Lợi (Huyện Bình Chánh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (176, 'Xã Tân Nhựt (Huyện Bình Chánh)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (177, 'Xã Bình Chánh (Huyện Bình Chánh..)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (178, 'Xã Hưng Long (Huyện Bình Chánh..)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (179, 'Xã Bình Hưng (Bình Chánh..)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (180, 'Xã Bình Khánh (ấp Bình An 1)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (181, 'Xã An Thới Đông (xã An Thới Đông)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (182, 'Xã Cần Giờ (KP. Giồng Ao)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (183, 'Xã Củ Chi (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (184, 'Xã Tân An Hội (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (185, 'Xã Thái Mỹ (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (186, 'Xã An Nhơn Tây (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (187, 'Xã Nhuận Đức (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (188, 'Xã Phú Hòa Đông (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (189, 'Xã Bình Mỹ (Huyện Củ Chi)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (190, 'Xã Đông Thạnh (Huyện Hóc Môn)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (191, 'Xã Hóc Môn (Huyện Hóc Môn)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (192, 'Xã Xuân Thới Sơn (Huyện Hóc Môn)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (193, 'Xã Bà Điểm (Huyện Hóc Môn)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (194, 'Xã Nhà Bè (Huyện Nhà Bè)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (195, 'Xã Hiệp Phước (Huyện Nhà Bè)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (196, 'Xã Thường Tân (Huyện Bắc Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (197, 'Xã Bắc Tân Uyên (Huyện Bắc Tân Uyên)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (198, 'Xã Phú Giáo (Huyện Phú Giáo)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (199, 'Xã Phước Hòa (Huyện Phú Giáo)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (200, 'Xã Phước Thành (Huyện Phú Giáo)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (201, 'Xã An Long (Huyện Phú Giáo)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (202, 'Xã Trừ Văn Thố (Huyện Bàu Bàng)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (203, 'Xã Bàu Bàng (Huyện Bàu Bàng)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (204, 'Xã Long Hòa (Huyện Dầu Tiếng)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (205, 'Xã Thanh An (Huyện Dầu Tiếng)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (206, 'Xã Dầu Tiếng (Huyện Dầu Tiếng)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (207, 'Xã Minh Thạnh (Huyện Dầu Tiếng)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (208, 'Xã Châu Pha (TP. Phú Mỹ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (209, 'Xã Long Hải (Huyện Long Đất)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (210, 'Xã Long Điền (Huyện Long Đất)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (211, 'Xã Phước Hải (Huyện Long Đất)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (212, 'Xã Đất Đỏ (thị trấn Đất Đỏ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (213, 'Xã Nghĩa Thành (Huyện Châu Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (214, 'Xã Ngãi Giao (Huyện Châu Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (215, 'Xã Kim Long (Huyện Châu Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (216, 'Xã Châu Đức (Huyện Châu Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (217, 'Xã Bình Giã (Huyện Châu Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (218, 'Xã Xuân Sơn (Huyện Châu Đức)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (219, 'Xã Hồ Tràm (Huyện Xuyên Mộc)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (220, 'Xã Xuyên Mộc (Huyện Xuyên Mộc)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (221, 'Xã Hòa Hội (Huyện Xuyên Mộc)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (222, 'Xã Bàu Lâm (Huyện Xuyên Mộc)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (223, 'Đặc khu Côn Đảo (Huyện Côn Đảo)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (224, 'Xã Bình Châu (Huyện Xuyên Mộc)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (225, 'Xã Hòa Hiệp (Huyện Xuyên Mộc)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (226, 'Xã Long Sơn (TP. Vũng Tàu)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (227, 'Xã Thạnh An (Huyện Cần Giờ)', 1);
INSERT INTO public.districts (id, name, province_id) VALUES (228, 'Phường Thới Hòa (TP. Bến Cát)', 1);


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

INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (98, 'NLTS', 'Nông, lâm nghiệp và thủy sản', 1, true, '2026-06-24 19:20:42.02325', '2026-06-24 19:20:42.02325', NULL);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (99, 'NLTS-01', 'Nông nghiệp và hoạt động dịch vụ liên quan', 2, true, '2026-06-24 19:20:42.02881', '2026-06-24 19:20:42.02881', 98);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (100, 'NLTS-011', 'Nhóm ngành cấp 3 (011)', 3, true, '2026-06-24 19:20:42.031197', '2026-06-24 19:20:42.031197', 99);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (101, 'NLTS-0111', 'Trồng cây lương thực', 4, true, '2026-06-24 19:20:42.033149', '2026-06-24 19:20:42.033149', 100);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (102, 'NLTS-0112', 'Trồng cây công nghiệp', 4, true, '2026-06-24 19:20:42.037486', '2026-06-24 19:20:42.037486', 100);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (103, 'NLTS-0113', 'Trồng cây ăn quả', 4, true, '2026-06-24 19:20:42.039828', '2026-06-24 19:20:42.039828', 100);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (104, 'NLTS-014', 'Nhóm ngành cấp 3 (014)', 3, true, '2026-06-24 19:20:42.042165', '2026-06-24 19:20:42.042165', 99);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (105, 'NLTS-0141', 'Chăn nuôi trâu, bò', 4, true, '2026-06-24 19:20:42.044193', '2026-06-24 19:20:42.044193', 104);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (106, 'CNCB', 'Công nghiệp chế biến, chế tạo', 1, true, '2026-06-24 19:20:42.046127', '2026-06-24 19:20:42.046127', NULL);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (107, 'CNCB-10', 'Sản xuất, chế biến thực phẩm', 2, true, '2026-06-24 19:20:42.048015', '2026-06-24 19:20:42.048015', 106);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (108, 'CNCB-101', 'Nhóm ngành cấp 3 (101)', 3, true, '2026-06-24 19:20:42.049833', '2026-06-24 19:20:42.049833', 107);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (109, 'CNCB-1011', 'Chế biến và bảo quản thịt', 4, true, '2026-06-24 19:20:42.051693', '2026-06-24 19:20:42.051693', 108);
INSERT INTO public.industries (id, code, name, level, is_active, created_at, updated_at, parent_id) VALUES (110, 'NN_NLTS_0111_TRONG_CAY_LUONG_THUC', 'NLTS-0111 - Trồng cây lương thực', 1, true, '2026-06-25 04:53:00.173866', '2026-06-25 04:53:00.173866', NULL);


ALTER TABLE public.industries ENABLE TRIGGER ALL;

--
-- Data for Name: enterprises; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.enterprises DISABLE TRIGGER ALL;

INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (31, 'Công ty CP Đầu tư Bình Minh', '910000888296', '2019-07-20', '88 Nguyễn Đình Chiểu, Phường Bàn Cờ, Quận 3', 'Binh Minh Investment Joint Stock Company', 'info@binhminh.vn', '02838282892', '25 Lê Lợi, Phường Bàn Cờ, Quận 1', 'Lê Thị Bình', '0909234567', '910000888296', '12345678', true, '2026-06-24 19:20:42.061984', '2026-06-24 19:20:42.061984', 1, 102, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (32, 'Doanh nghiệp tư nhân Hoàng Anh', '910000888297', '2021-01-10', '12 Pasteur, Phường Xuân Hòa, Quận 1', 'Hoang Anh Private Enterprise', 'hoanganh@dntn.vn', '02838282893', '78 Hai Bà Trưng, Phường Xuân Hòa, Quận 1', 'Nguyễn Hoàng Anh', '0909345678', '910000888297', 'HoangAnh@2024', true, '2026-06-24 19:20:42.064646', '2026-06-24 19:20:42.064646', 4, 103, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (33, 'Công ty TNHH Sản xuất Thực phẩm Xanh', '910000888298', '2022-05-30', '67 Võ Văn Tần, Phường Khánh Hội, Quận 3', 'Xanh Food Production Company Limited', 'xanh@thucpham.vn', '02838282894', '15 Nguyễn Trãi, Phường Khánh Hội, Quận 5', 'Phạm Thị Xanh', '0909456789', '910000888298', 'Xanh@123', true, '2026-06-24 19:20:42.06765', '2026-06-24 19:20:42.06765', 2, 105, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (34, 'Công ty CP Xây dựng và Đầu tư Nam Phương', '910000888299', '2018-11-05', '123 Nguyễn Văn Linh, Phường An Đông, Quận 7', 'Nam Phuong Construction & Investment JSC', 'info@namphuong.vn', '02838282895', '456 Phạm Hùng, Phường An Đông, Quận 8', 'Hoàng Văn Nam', '0909567890', '910000888299', 'Default@123', true, '2026-06-24 19:20:42.070039', '2026-06-25 04:32:29.510191', 1, 109, 1, 223, 1, 223);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (35, 'Công ty TNHH Thương mại Dịch vụ Đông Á', '910000888300', '2020-09-18', '90 Bùi Thị Xuân, Phường Bình Phú, Quận 1', 'Dong A Trading Service Company Limited', 'contact@donga.vn', '02838282896', '22 Cống Quỳnh, Phường Bình Phú, Quận 1', 'Trương Minh Đông', '0909678901', '910000888300', 'Default@123', true, '2026-06-24 19:20:42.072633', '2026-06-25 04:32:37.73141', 2, 101, 1, 110, 1, 72);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (30, 'Công ty TNHH Thương mại ABC', '910000888295', '2020-03-15', '45 Lý Tự Trọng, Phường Bến Thành, Quận 1', 'ABC Trading Company Limited', 'abc@thuongmai.vn', '02838282891', 'Số 10 Nguyễn Huệ, Phường Bến Thành, Quận 1', 'Trần Văn An', '0909123456', '910000888295', 'Default@123', true, '2026-06-24 19:20:42.057865', '2026-06-25 04:53:00.182314', 2, 110, 1, 223, 1, 223);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (37, 'Công ty CP Công nghệ Thông tin Sài Gòn', '910000888302', '2017-06-01', '789 Lê Văn Sỹ, Phường Tân Thuận Đông, Quận 3', 'Saigon Information Technology JSC', 'info@sgontech.vn', '02838282898', '12 Nguyễn Thị Minh Khai, Phường Tân Thuận Đông, Quận 1', 'Võ Thành Công', '0909890123', '910000888302', 'SaiGon@2024', true, '2026-06-24 19:20:42.077822', '2026-06-24 19:20:42.077822', 1, 109, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (38, 'Công ty TNHH Vận tải Biển Xanh', '910000888303', '2019-12-20', '55 Nguyễn Tất Thành, Phường Bình Đông, Quận 4', 'Blue Sea Transport Company Limited', 'info@bientrinh.vn', '02838282899', '200 Lê Văn Lương, Phường Bình Đông, Quận 7', 'Nguyễn Hải Đăng', '0909901234', '910000888303', 'BienXanh@2024', true, '2026-06-24 19:20:42.08012', '2026-06-24 19:20:42.08012', 2, 105, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (39, 'Công ty TNHH 1TV Sản xuất Bao bì An Khang', '910000888304', '2021-08-10', '18 Quốc lộ 13, Phường Tân Thới Nhất, Quận 12', 'An Khang Packaging Manufacturing Co., Ltd.', 'ankhang@baobi.vn', '02838282900', '7/2 Tân Thới Nhất, Phường Tân Thới Nhất, Quận 12', 'Trần An Khang', '0910012345', '910000888304', 'AnKhang@2024', true, '2026-06-24 19:20:42.083384', '2026-06-24 19:20:42.083384', 3, 102, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (40, 'Hộ kinh doanh Thực phẩm Hữu cơ', '910000888305', '2024-01-05', '99 Chợ Lớn, Phường An Phú Đông, Quận 6', '', 'huuco@organic.vn', '02838282901', '99 Chợ Lớn, Phường An Phú Đông, Quận 6', 'Lý Thị Hương', '0910123456', '910000888305', 'HuuCo@2024', true, '2026-06-24 19:20:42.085879', '2026-06-24 19:20:42.085879', 6, 103, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (41, 'Hợp tác xã Nông nghiệp Công nghệ Cao', '910000888306', '2022-04-22', '1 Xa lộ Hà Nội, Phường An Lạc, Quận 9', 'High-Tech Agricultural Cooperative', 'htx@nncnc.vn', '02838282902', 'Khu CNC, Phường An Lạc, Thành phố Thủ Đức', 'Ngô Văn Nông', '0910234567', '910000888306', 'CongNghe@2024', true, '2026-06-24 19:20:42.088432', '2026-06-24 19:20:42.088432', 7, 101, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (42, 'Công ty CP Dịch vụ Du lịch Mê Kông', '910000888307', '2016-05-12', '28 Phạm Ngũ Lão, Phường Bình Tân, Quận 1', 'Mekong Tourism Services JSC', 'info@mekongtravel.vn', '02838282903', '150 Đề Thám, Phường Bình Tân, Quận 1', 'Phạm Mê Kông', '0910345678', '910000888307', 'MeKong@2024', true, '2026-06-24 19:20:42.090368', '2026-06-24 19:20:42.090368', 1, 109, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (43, 'Công ty TNHH Thiết kế Xây dựng Hoàn Mỹ', '910000888308', '2020-10-30', '63 Hoàng Diệu, Phường Bình Hưng Hòa, Quận 4', 'Hoan My Design & Construction Company Limited', 'info@hoanmy.vn', '02838282904', '91 Nguyễn Thị Thập, Phường Bình Hưng Hòa, Quận 7', 'Đỗ Hoàn Mỹ', '0910456789', '910000888308', 'HoanMy@2024', true, '2026-06-24 19:20:42.092421', '2026-06-24 19:20:42.092421', 2, 102, 1, NULL, 1, NULL);
INSERT INTO public.enterprises (id, name, tax_code, license_date, address, foreign_name, email, phone, operation_address, leader_name, leader_phone, username, password, is_active, created_at, updated_at, enterprise_type_id, industry_id, province_id, ward_id, operation_province_id, operation_ward_id) VALUES (36, 'Doanh nghiệp tư nhân Minh Phát', '910000888301', '2023-02-14', '34 Ngô Gia Tự, Phường Bình Tây, Quận 10', 'Minh Phat Private Enterprise', 'minhphat@dntn.vn', '02838282897', '56 Lý Thường Kiệt, Phường Bình Tây, Quận 10', 'Đặng Minh Phát', '0909789012', '910000888301', 'Default@123', true, '2026-06-24 19:20:42.075449', '2026-06-25 04:32:58.751235', 4, 103, 1, 110, 1, 72);


ALTER TABLE public.enterprises ENABLE TRIGGER ALL;

--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.attachments DISABLE TRIGGER ALL;

INSERT INTO public.attachments (id, name, file_name, file_path, file_size, created_at, enterprise_id) VALUES (4, 'Giấy phép kinh doanh', 'TOMATO TEST.pdf', '/uploads/enterprises/30/1782360243122-iooqo0gzeqf.pdf', 3521626, '2026-06-25 04:04:03.149264', 30);
INSERT INTO public.attachments (id, name, file_name, file_path, file_size, created_at, enterprise_id) VALUES (5, 'Giấy tờ khác', 'on tap 2026 - Pháº§n 1.pdf', '/uploads/enterprises/30/1782360243161-99b2zmzo4tl.pdf', 71092, '2026-06-25 04:04:03.166776', 30);


ALTER TABLE public.attachments ENABLE TRIGGER ALL;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.roles DISABLE TRIGGER ALL;

INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (1, 'ADMIN', 'Quản trị viên', '2026-06-11 08:32:00.586972', '2026-06-11 08:32:00.586972');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (2, 'MANAGER', 'Manager', '2026-06-11 08:32:00.591706', '2026-06-11 08:32:00.591706');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (3, 'EMPLOYEE', 'Employee', '2026-06-11 08:32:00.594037', '2026-06-11 08:32:00.594037');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (4, 'CEO', 'CEO', '2026-06-11 08:32:00.598169', '2026-06-11 08:32:00.598169');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (6, 'ROLE_ADMIN', 'Admin', '2026-06-24 19:20:41.860793', '2026-06-24 19:20:41.860793');
INSERT INTO public.roles (id, code, name, created_at, updated_at) VALUES (7, 'ROLE_ENTERPRISE', 'Enterprise', '2026-06-24 19:20:41.865292', '2026-06-24 19:20:41.865292');


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
INSERT INTO public.titles (id, name, created_at) VALUES (6, 'Dev', '2026-06-24 20:18:41.957886');


ALTER TABLE public.titles ENABLE TRIGGER ALL;

--
-- Data for Name: user_avatars; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.user_avatars DISABLE TRIGGER ALL;

INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (2, '1781169008966-catt.jpg', 'uploads/avatars/244a4bb8-61fc-4994-8575-585fa235454d/1781169008966-catt.jpg', 27885, 'image/jpeg', '2026-06-11 09:10:08.970518', '244a4bb8-61fc-4994-8575-585fa235454d');
INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (3, '1781171282463-catt.jpg', 'uploads/avatars/14cf1098-544d-4ea0-ace9-7b3e2c20fd9f/1781171282463-catt.jpg', 27885, 'image/jpeg', '2026-06-11 09:48:02.469189', '14cf1098-544d-4ea0-ace9-7b3e2c20fd9f');
INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (4, '1781171298548-444.jpg', 'uploads/avatars/2845b57a-16bb-479d-bc16-9e4a1f1d0a44/1781171298548-444.jpg', 495215, 'image/jpeg', '2026-06-11 09:48:18.563187', '2845b57a-16bb-479d-bc16-9e4a1f1d0a44');
INSERT INTO public.user_avatars (id, file_name, file_path, file_size, mime_type, uploaded_at, user_id) VALUES (1, '1782331370953-cat.jpg', 'uploads/avatars/ba4f41b1-3531-4d7b-bae4-6db019b97b4d/1782331370953-cat.jpg', 76724, 'image/jpeg', '2026-06-11 09:09:58.603434', 'ba4f41b1-3531-4d7b-bae4-6db019b97b4d');


ALTER TABLE public.user_avatars ENABLE TRIGGER ALL;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('42414bfc-a2cd-4506-b985-96de495540dd', '910000888295', '$2b$10$5xOpV2wRsUqMmh7YAFE6WeQo1P38THhIPAOu47ZuXitek4NttmwW2', 'Công ty TNHH Thương mại ABC', 'abc@thuongmai.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('195ac07a-c1e1-4c05-948f-008729942c42', '910000888296', '$2b$10$5xOpV2wRsUqMmh7YAFE6WeQo1P38THhIPAOu47ZuXitek4NttmwW2', 'Công ty CP Đầu tư Bình Minh', 'info@binhminh.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('244a4bb8-61fc-4994-8575-585fa235454d', 'banbanban', '$2b$10$dGQG58n0bweIMP3gJUp/4uWjWMspzLrtX.iSuIW5KRdbWil376Tsq', 'Võ Kim Bằng', 'vokimbang@gmail.com', '2004-10-22', 'Nam', '/uploads/avatars/244a4bb8-61fc-4994-8575-585fa235454d/1781169008966-catt.jpg', '241 Hùng Vương', true, '2026-06-11 09:09:43.944026', '2026-06-11 09:10:10.057904', NULL, 3, 3, 1, NULL, 2, 'internal');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('14cf1098-544d-4ea0-ace9-7b3e2c20fd9f', 'ducduc', '$2b$10$ANzfUuy.kbjiiSlHf.94d.qPAvZwVbSL/vMseHQyr5Qv5PTirciEa', 'Võ Văn Đức', '3122410015@sv.sgu.edu.vn', '2004-02-01', 'Nam', '/uploads/avatars/14cf1098-544d-4ea0-ace9-7b3e2c20fd9f/1781171282463-catt.jpg', '333 Trần Phú', true, '2026-06-11 09:48:02.396798', '2026-06-11 12:51:54.671478', NULL, 2, 4, 1, NULL, 3, 'internal');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('2845b57a-16bb-479d-bc16-9e4a1f1d0a44', 'baobao', '$2b$10$6sASgAFIwfW4iz9WjrwmvOslgiUWS.reQYuWifcskSvSAHnPg68Fe', 'Hà Ngọc Thiên Bảo', 'hntb0102@gmail.com', '2004-02-01', 'Nam', '/uploads/avatars/2845b57a-16bb-479d-bc16-9e4a1f1d0a44/1781171298548-444.jpg', '77/20 An Dương Vương', true, '2026-06-11 09:28:52.301956', '2026-06-11 12:51:56.093809', NULL, 4, 1, 1, NULL, 4, 'internal');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('b97415bb-2636-4b56-b797-6a72156db3ef', '910000888299', '$2b$10$mxHVXIab0r/M6tGfCa3eF.lOpPFGaSY5bKblUMDVzSwid5xCkUorK', 'Công ty CP Xây dựng và Đầu tư Nam Phương', 'info@namphuong.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.086911', '2026-06-24 19:44:22.086911', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('0c2680f0-b673-4fbc-b23a-a8d0716d8825', '910000888300', '$2b$10$BepnC5QptZA3MfNcZbXDpeKLnwwBn.fdMolYXc5ZDZNJ6eHmzhGsW', 'Công ty TNHH Thương mại Dịch vụ Đông Á', 'contact@donga.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.089442', '2026-06-24 19:44:22.089442', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('68663fe9-31e2-47fa-b369-7abdd4343047', '910000888301', '$2b$10$UG2NDvN5lgqsPOOKqqnr8.eqaJU795ihs3fEcu1NbspaVEPCMm59W', 'Doanh nghiệp tư nhân Minh Phát', 'minhphat@dntn.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.090441', '2026-06-24 19:44:22.090441', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('26738afe-d988-42eb-b1a7-b78fc213d936', '910000888302', '$2b$10$nbAYbbq7xoF9vyJBZojyK.A6DjNpCKuNA0FcNagTSEt/UcomBysVu', 'Công ty CP Công nghệ Thông tin Sài Gòn', 'info@sgontech.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.091354', '2026-06-24 19:44:22.091354', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('955fe6ea-ef35-411e-a899-7e0e4916c925', '910000888303', '$2b$10$zNbKkHeGuek2zWqKrn2U5ec47p/MD4ZLKFb8CoUKf2ofGrWabO5BW', 'Công ty TNHH Vận tải Biển Xanh', 'info@bientrinh.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.092306', '2026-06-24 19:44:22.092306', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('3e0e2a12-3182-457d-8249-6881107abbea', '910000888304', '$2b$10$6/PtMqJezRZv0gZq/puY1OjLuK7IV7Y3cuNQKLy8NKBG5viq46w/e', 'Công ty TNHH 1TV Sản xuất Bao bì An Khang', 'ankhang@baobi.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.093606', '2026-06-24 19:44:22.093606', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('79e9176d-680c-4b1c-8cde-2c8e039f6990', '910000888305', '$2b$10$gOvbocALtmmWM4RnRabZzu5I1txOneriP2Umt5XKljVd0cijDdQwi', 'Hộ kinh doanh Thực phẩm Hữu cơ', 'huuco@organic.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.095166', '2026-06-24 19:44:22.095166', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('61d76a25-2338-434d-a945-55601c0a83bf', '910000888306', '$2b$10$6dnb9DVpsiPbBlaVGTRNfOWnuDRRz40DZ3XMqqcY1wXrfv8Nj8yb2', 'Hợp tác xã Nông nghiệp Công nghệ Cao', 'htx@nncnc.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.09685', '2026-06-24 19:44:22.09685', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('aea5d7d3-7a69-4e69-8b50-3574aa9355b5', '910000888307', '$2b$10$0Dcdt.wd/lAJaxa5K9IfQekT.cIlU402DdsjxSzJRNTW0XSdiF37O', 'Công ty CP Dịch vụ Du lịch Mê Kông', 'info@mekongtravel.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.098107', '2026-06-24 19:44:22.098107', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('7a34c19f-4c87-4e11-9546-8fb5d5346079', '910000888308', '$2b$10$zn1VTQnQCjC9.QrfOVuIL.Co9yi.xWAx9y9HhAowak.nhM8ia/HJW', 'Công ty TNHH Thiết kế Xây dựng Hoàn Mỹ', 'info@hoanmy.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-24 19:44:22.099274', '2026-06-24 19:44:22.099274', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('245ddcf4-5ff8-4ae4-84d5-9f645a63d694', '910000888297', '$2b$10$Lrb3epfsj/DdBwnvae0DXe8ePRGR6cfoSptkIDAWLWdv/TARlzNKW', 'Doanh nghiệp tư nhân Hoàng Anh', 'hoanganh@dntn.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('09b5659d-7c11-4644-a3ac-9401d15bec0b', '910000888298', '$2b$10$sKqSfqQIRvVUF.BE4H83yuiv/F2UPo86zUAySDTtLl2xx141nd5Py', 'Công ty TNHH Sản xuất Thực phẩm Xanh', 'xanh@thucpham.vn', NULL, 'Nam', NULL, NULL, true, '2026-06-12 05:15:18.27477', '2026-06-12 05:15:18.27477', NULL, 7, NULL, NULL, NULL, NULL, 'enterprise');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('ba4f41b1-3531-4d7b-bae4-6db019b97b4d', 'admin', '$2b$10$/6Nl9tJdgXWi12i5f./KluVFM39S3OlT.Y57x2sG1zSmfCRlkxFwC', 'Administrator', 'vnagroup@gmail.com', '2004-12-10', 'Nam', '/uploads/avatars/ba4f41b1-3531-4d7b-bae4-6db019b97b4d/1782331370953-cat.jpg', '77/20 An Dương Vương', true, '2026-06-11 08:32:00.692727', '2026-06-24 20:02:59.09896', NULL, 4, 1, 1, NULL, 1, 'internal');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('ee046766-1237-4dfb-83c7-3a100f973cc0', 'testuser', '$2b$10$mg4d2c6s0f1YI.4vlNXY1.6HedVcCKONdU0TVv8VR3D8lgOFvxrX.', 'Test User', 'test@test.com', NULL, 'Nam', NULL, NULL, true, '2026-06-24 20:18:41.967693', '2026-06-24 20:18:41.967693', NULL, 4, 6, 1, NULL, NULL, 'internal');
INSERT INTO public.users (id, username, password_hash, full_name, email, date_of_birth, gender, avatar_url, address, is_active, created_at, updated_at, deleted_at, role_id, title_id, province_id, district_id, avatar_id, account_type) VALUES ('19945e74-5846-4a08-b9e5-b6bbd961970c', 'khhan', '$2b$10$o9VEFet/8Zn8KAnE.TFFOevSqyE5d1Hadhe53QHqeRIFJQwuQGPaK', 'Nguyễn Thị Khánh Hân', 'khhan@gmail.com', '2006-06-13', 'Nữ', NULL, '333 Trần Phú', true, '2026-06-24 20:05:25.715548', '2026-06-25 02:00:15.047041', NULL, 3, 4, 1, 61, NULL, 'internal');


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

INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (1, 'ADMIN_G_DEPARTMENT', 'Department Group', 0, '2026-06-11 08:32:00.446631', '2026-06-11 08:32:00.446631', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (6, 'ADMIN_G_ROLE', 'Role Group', 1, '2026-06-11 08:32:00.504304', '2026-06-11 08:32:00.504304', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (11, 'ADMIN_G_USER', 'User Group', 2, '2026-06-11 08:32:00.536527', '2026-06-11 08:32:00.536527', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (16, 'ADMIN_G_PERMISSION', 'Permission Group', 3, '2026-06-11 08:32:00.555354', '2026-06-11 08:32:00.555354', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (19, 'ADMIN_G_REPORT', 'Report Group', 4, '2026-06-11 08:32:00.562953', '2026-06-11 08:32:00.562953', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (2, 'ADMIN_C_DEPARTMENT_VIEW', 'View Department', 0, '2026-06-11 08:32:00.482791', '2026-06-11 08:32:00.482791', 1, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (3, 'ADMIN_C_DEPARTMENT_CREATE', 'Create Department', 1, '2026-06-11 08:32:00.489335', '2026-06-11 08:32:00.489335', 1, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (4, 'ADMIN_C_DEPARTMENT_UPDATE', 'Update Department', 2, '2026-06-11 08:32:00.494311', '2026-06-11 08:32:00.494311', 1, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (5, 'ADMIN_C_DEPARTMENT_DELETE', 'Delete Department', 3, '2026-06-11 08:32:00.499994', '2026-06-11 08:32:00.499994', 1, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (7, 'ADMIN_C_ROLE_VIEW', 'View Role', 0, '2026-06-11 08:32:00.508943', '2026-06-11 08:32:00.508943', 6, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (8, 'ADMIN_C_ROLE_CREATE', 'Create Role', 1, '2026-06-11 08:32:00.511911', '2026-06-11 08:32:00.511911', 6, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (9, 'ADMIN_C_ROLE_UPDATE', 'Update Role', 2, '2026-06-11 08:32:00.517131', '2026-06-11 08:32:00.517131', 6, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (10, 'ADMIN_C_ROLE_DELETE', 'Delete Role', 3, '2026-06-11 08:32:00.525745', '2026-06-11 08:32:00.525745', 6, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (12, 'ADMIN_C_USER_VIEW', 'View User', 0, '2026-06-11 08:32:00.54042', '2026-06-11 08:32:00.54042', 11, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (13, 'ADMIN_C_USER_CREATE', 'Create User', 1, '2026-06-11 08:32:00.543816', '2026-06-11 08:32:00.543816', 11, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (14, 'ADMIN_C_USER_UPDATE', 'Update User', 2, '2026-06-11 08:32:00.547401', '2026-06-11 08:32:00.547401', 11, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (15, 'ADMIN_C_USER_DELETE', 'Delete User', 3, '2026-06-11 08:32:00.551879', '2026-06-11 08:32:00.551879', 11, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (17, 'ADMIN_C_PERMISSION_VIEW', 'View Permission', 0, '2026-06-11 08:32:00.557855', '2026-06-11 08:32:00.557855', 16, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (18, 'ADMIN_C_PERMISSION_ASSIGN', 'Assign Permission', 1, '2026-06-11 08:32:00.560092', '2026-06-11 08:32:00.560092', 16, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (20, 'ADMIN_C_REPORT_VIEW', 'View Report', 0, '2026-06-11 08:32:00.565188', '2026-06-11 08:32:00.565188', 19, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (21, 'ADMIN_G_ENTERPRISE', 'Enterprise Management Group', 5, '2026-06-24 19:20:41.727801', '2026-06-24 19:20:41.727801', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (22, 'ADMIN_C_ENTERPRISE_VIEW', 'View Enterprise', 0, '2026-06-24 19:20:41.737941', '2026-06-24 19:20:41.737941', 21, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (23, 'ADMIN_C_ENTERPRISE_CREATE', 'Create Enterprise', 1, '2026-06-24 19:20:41.74214', '2026-06-24 19:20:41.74214', 21, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (24, 'ADMIN_C_ENTERPRISE_UPDATE', 'Update Enterprise', 2, '2026-06-24 19:20:41.748329', '2026-06-24 19:20:41.748329', 21, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (25, 'ADMIN_C_ENTERPRISE_DELETE', 'Delete Enterprise', 3, '2026-06-24 19:20:41.75231', '2026-06-24 19:20:41.75231', 21, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (26, 'ADMIN_G_ENTERPRISE_TYPE', 'Enterprise Type Group', 6, '2026-06-24 19:20:41.755596', '2026-06-24 19:20:41.755596', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (27, 'ADMIN_C_ENTERPRISE_TYPE_VIEW', 'View Enterprise Type', 0, '2026-06-24 19:20:41.759084', '2026-06-24 19:20:41.759084', 26, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (28, 'ADMIN_C_ENTERPRISE_TYPE_CREATE', 'Create Enterprise Type', 1, '2026-06-24 19:20:41.762147', '2026-06-24 19:20:41.762147', 26, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (29, 'ADMIN_C_ENTERPRISE_TYPE_UPDATE', 'Update Enterprise Type', 2, '2026-06-24 19:20:41.764878', '2026-06-24 19:20:41.764878', 26, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (30, 'ADMIN_C_ENTERPRISE_TYPE_DELETE', 'Delete Enterprise Type', 3, '2026-06-24 19:20:41.768445', '2026-06-24 19:20:41.768445', 26, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (31, 'ADMIN_G_INDUSTRY', 'Industry Group', 7, '2026-06-24 19:20:41.772103', '2026-06-24 19:20:41.772103', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (32, 'ADMIN_C_INDUSTRY_VIEW', 'View Industry', 0, '2026-06-24 19:20:41.775446', '2026-06-24 19:20:41.775446', 31, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (33, 'ADMIN_C_INDUSTRY_CREATE', 'Create Industry', 1, '2026-06-24 19:20:41.778297', '2026-06-24 19:20:41.778297', 31, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (34, 'ADMIN_C_INDUSTRY_UPDATE', 'Update Industry', 2, '2026-06-24 19:20:41.781056', '2026-06-24 19:20:41.781056', 31, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (35, 'ADMIN_C_INDUSTRY_DELETE', 'Delete Industry', 3, '2026-06-24 19:20:41.783738', '2026-06-24 19:20:41.783738', 31, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (36, 'ADMIN_G_REPORT_PERIOD', 'Report Period Group', 8, '2026-06-24 19:20:41.786463', '2026-06-24 19:20:41.786463', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (37, 'ADMIN_C_REPORT_PERIOD_VIEW', 'View Report Period', 0, '2026-06-24 19:20:41.788712', '2026-06-24 19:20:41.788712', 36, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (38, 'ADMIN_C_REPORT_PERIOD_CREATE', 'Create Report Period', 1, '2026-06-24 19:20:41.791089', '2026-06-24 19:20:41.791089', 36, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (39, 'ADMIN_C_REPORT_PERIOD_UPDATE', 'Update Report Period', 2, '2026-06-24 19:20:41.793392', '2026-06-24 19:20:41.793392', 36, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (40, 'ADMIN_C_REPORT_PERIOD_DELETE', 'Delete Report Period', 3, '2026-06-24 19:20:41.795572', '2026-06-24 19:20:41.795572', 36, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (41, 'ADMIN_G_TNLD_CATEGORY', 'TNLD Category Group', 9, '2026-06-24 19:20:41.797965', '2026-06-24 19:20:41.797965', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (42, 'ADMIN_C_TNLD_CATEGORY_VIEW', 'View TNLD Category', 0, '2026-06-24 19:20:41.800272', '2026-06-24 19:20:41.800272', 41, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (43, 'ADMIN_C_TNLD_CATEGORY_CREATE', 'Create TNLD Category', 1, '2026-06-24 19:20:41.802518', '2026-06-24 19:20:41.802518', 41, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (44, 'ADMIN_C_TNLD_CATEGORY_UPDATE', 'Update TNLD Category', 2, '2026-06-24 19:20:41.804837', '2026-06-24 19:20:41.804837', 41, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (45, 'ADMIN_C_TNLD_CATEGORY_DELETE', 'Delete TNLD Category', 3, '2026-06-24 19:20:41.806893', '2026-06-24 19:20:41.806893', 41, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (46, 'ADMIN_G_TNLD_CONTRACT', 'TNLD Contract Report Group', 10, '2026-06-24 19:20:41.809164', '2026-06-24 19:20:41.809164', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (47, 'ADMIN_C_TNLD_CONTRACT_VIEW', 'View TNLD Contract Report', 0, '2026-06-24 19:20:41.811523', '2026-06-24 19:20:41.811523', 46, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (48, 'ADMIN_C_TNLD_CONTRACT_ACCEPT', 'Accept TNLD Contract Report', 1, '2026-06-24 19:20:41.813901', '2026-06-24 19:20:41.813901', 46, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (49, 'ADMIN_C_TNLD_CONTRACT_PRINT', 'Print TNLD Contract Report', 2, '2026-06-24 19:20:41.816602', '2026-06-24 19:20:41.816602', 46, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (50, 'ENTERPRISE_G_PROFILE', 'Enterprise Profile Group', 11, '2026-06-24 19:20:41.818929', '2026-06-24 19:20:41.818929', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (51, 'ENTERPRISE_C_PROFILE_VIEW', 'View Enterprise Profile', 0, '2026-06-24 19:20:41.821076', '2026-06-24 19:20:41.821076', 50, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (52, 'ENTERPRISE_C_PROFILE_UPDATE', 'Update Enterprise Profile', 1, '2026-06-24 19:20:41.823521', '2026-06-24 19:20:41.823521', 50, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (53, 'ENTERPRISE_G_ATTACHMENT', 'Enterprise Attachment Group', 12, '2026-06-24 19:20:41.825572', '2026-06-24 19:20:41.825572', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (54, 'ENTERPRISE_C_ATTACHMENT_VIEW', 'View Enterprise Attachment', 0, '2026-06-24 19:20:41.828138', '2026-06-24 19:20:41.828138', 53, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (55, 'ENTERPRISE_C_ATTACHMENT_UPLOAD', 'Upload Enterprise Attachment', 1, '2026-06-24 19:20:41.83033', '2026-06-24 19:20:41.83033', 53, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (56, 'ENTERPRISE_C_ATTACHMENT_DELETE', 'Delete Enterprise Attachment', 2, '2026-06-24 19:20:41.833179', '2026-06-24 19:20:41.833179', 53, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (57, 'ENTERPRISE_G_CONTRACT', 'Enterprise Contract Group', 13, '2026-06-24 19:20:41.83585', '2026-06-24 19:20:41.83585', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (58, 'ENTERPRISE_C_CONTRACT_VIEW', 'View Enterprise Contract', 0, '2026-06-24 19:20:41.838601', '2026-06-24 19:20:41.838601', 57, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (59, 'ENTERPRISE_C_CONTRACT_CREATE', 'Create Enterprise Contract', 1, '2026-06-24 19:20:41.841311', '2026-06-24 19:20:41.841311', 57, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (60, 'ENTERPRISE_C_CONTRACT_UPDATE', 'Update Enterprise Contract', 2, '2026-06-24 19:20:41.844192', '2026-06-24 19:20:41.844192', 57, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (61, 'ENTERPRISE_G_REPORT', 'Enterprise Report Group', 14, '2026-06-24 19:20:41.846898', '2026-06-24 19:20:41.846898', NULL, 'Group');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (62, 'ENTERPRISE_C_REPORT_VIEW', 'View Enterprise Report', 0, '2026-06-24 19:20:41.849777', '2026-06-24 19:20:41.849777', 61, 'Component');
INSERT INTO public.permissions (id, code, name, sort_order, created_at, updated_at, parent_id, type) VALUES (63, 'ENTERPRISE_C_REPORT_SUBMIT', 'Submit Enterprise Report', 1, '2026-06-24 19:20:41.852337', '2026-06-24 19:20:41.852337', 61, 'Component');


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
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 2);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 3);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 4);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 5);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 7);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 8);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 9);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 10);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 12);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 13);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 14);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 15);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 17);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 18);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 20);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 22);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 23);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 24);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 25);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 27);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 28);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 29);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 30);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 32);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 33);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 34);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 35);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 37);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 38);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 39);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 40);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 42);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 43);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 44);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 45);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 47);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 48);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 49);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 51);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 52);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 54);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 55);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 56);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 58);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 59);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 60);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 62);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (6, 63);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 22);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 23);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 24);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 25);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 27);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 28);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 29);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 30);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 32);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 33);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 34);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 35);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 37);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 38);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 39);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 40);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 42);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 43);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 44);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 45);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 47);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 48);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 49);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 51);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 52);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 54);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 55);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 56);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 58);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 59);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 60);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 62);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (1, 63);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 22);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 23);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 24);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 25);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 27);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 28);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 29);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 30);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 32);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 33);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 34);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 35);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 37);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 38);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 39);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 40);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 42);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 43);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 44);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 45);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 47);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 48);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 49);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 51);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 52);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 54);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 55);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 56);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 58);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 59);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 60);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 62);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (4, 63);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 51);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 52);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 54);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 55);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 56);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 58);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 59);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 60);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 62);
INSERT INTO public.role_permissions (role_id, permission_id) VALUES (7, 63);


ALTER TABLE public.role_permissions ENABLE TRIGGER ALL;

--
-- Data for Name: tnld_contract_reports; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.tnld_contract_reports DISABLE TRIGGER ALL;

INSERT INTO public.tnld_contract_reports (id, enterprise_id, year, period, status, submitted_at, created_at, updated_at) VALUES (1, 30, 2026, '6m', 'draft', NULL, '2026-06-25 04:55:29.787775', '2026-06-25 04:55:29.787775');


ALTER TABLE public.tnld_contract_reports ENABLE TRIGGER ALL;

--
-- Data for Name: tnld_contract_report_accident_details; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.tnld_contract_report_accident_details DISABLE TRIGGER ALL;

INSERT INTO public.tnld_contract_report_accident_details (id, report_id, sort_order, cause, injury_factor, occupation, total_accidents, fatal_accidents, multi_victim_accidents, total_victims, female_victims, dead_victims, severe_victims, unmanaged_victims, unmanaged_female_victims, unmanaged_dead_victims, unmanaged_severe_victims, medical_cost, treatment_salary_cost, compensation_cost, workdays_lost, asset_damage) VALUES (1, 1, 1, 'Đầu, mặt, cổ', 'Thiết bị nâng', 'Nhà lãnh đạo cơ quan Đảng cộng sản Việt Nam cấp Trung ương', 1, 1, 1, 10, 5, 5, 10, 0, 0, 0, 0, 10000000.00, 10000000.00, 10000000.00, 20, 10000000.00);
INSERT INTO public.tnld_contract_report_accident_details (id, report_id, sort_order, cause, injury_factor, occupation, total_accidents, fatal_accidents, multi_victim_accidents, total_victims, female_victims, dead_victims, severe_victims, unmanaged_victims, unmanaged_female_victims, unmanaged_dead_victims, unmanaged_severe_victims, medical_cost, treatment_salary_cost, compensation_cost, workdays_lost, asset_damage) VALUES (2, 1, 2, 'Đầu, mặt, cổ', 'Thiết bị nâng', 'Nhà lãnh đạo cơ quan Đảng cộng sản Việt Nam cấp Trung ương', 1, 0, 1, 10, 5, 0, 10, 0, 0, 0, 0, 10000000.00, 10000000.00, 10000000.00, 20, 10000000.00);


ALTER TABLE public.tnld_contract_report_accident_details ENABLE TRIGGER ALL;

--
-- Data for Name: tnld_contract_report_attachments; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.tnld_contract_report_attachments DISABLE TRIGGER ALL;



ALTER TABLE public.tnld_contract_report_attachments ENABLE TRIGGER ALL;

--
-- Data for Name: tnld_contract_report_overviews; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.tnld_contract_report_overviews DISABLE TRIGGER ALL;

INSERT INTO public.tnld_contract_report_overviews (id, report_id, total_employees, female_employees, payroll, total_accidents, fatal_accidents, multi_victim_accidents, total_victims, female_victims, dead_victims, severe_victims, unmanaged_victims, unmanaged_female_victims, unmanaged_dead_victims, unmanaged_severe_victims, medical_cost, treatment_salary_cost, compensation_cost, workdays_lost, asset_damage) VALUES (1, 1, 10, 5, 0.00, 2, 1, 1, 5, 1, 1, 1, 0, 0, 0, 0, 100000.00, 100000.00, 100000.00, 20, 0.00);


ALTER TABLE public.tnld_contract_report_overviews ENABLE TRIGGER ALL;

--
-- Data for Name: tnld_contract_report_subsidies; Type: TABLE DATA; Schema: public; Owner: vna_user
--

ALTER TABLE public.tnld_contract_report_subsidies DISABLE TRIGGER ALL;

INSERT INTO public.tnld_contract_report_subsidies (id, report_id, total_accidents, fatal_accidents, multi_victim_accidents, total_victims, female_victims, dead_victims, severe_victims, unmanaged_victims, unmanaged_female_victims, unmanaged_dead_victims, unmanaged_severe_victims, medical_cost, treatment_salary_cost, compensation_cost, total_cost, workdays_lost, asset_damage, note) VALUES (1, 1, 1, 1, 1, 10, 5, 5, 10, 0, 0, 0, 0, 10000000.00, 10000000.00, 10000000.00, 30000000.00, 20, 10000000.00, 'Không');


ALTER TABLE public.tnld_contract_report_subsidies ENABLE TRIGGER ALL;

--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.attachments_id_seq', 5, true);


--
-- Name: districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.districts_id_seq', 228, true);


--
-- Name: enterprise_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.enterprise_types_id_seq', 9, true);


--
-- Name: enterprises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.enterprises_id_seq', 43, true);


--
-- Name: industries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.industries_id_seq', 110, true);


--
-- Name: otp_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.otp_codes_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.permissions_id_seq', 63, true);


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

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- Name: titles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.titles_id_seq', 6, true);


--
-- Name: tnld_contract_report_accident_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.tnld_contract_report_accident_details_id_seq', 2, true);


--
-- Name: tnld_contract_report_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.tnld_contract_report_attachments_id_seq', 1, false);


--
-- Name: tnld_contract_report_overviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.tnld_contract_report_overviews_id_seq', 1, true);


--
-- Name: tnld_contract_report_subsidies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.tnld_contract_report_subsidies_id_seq', 1, true);


--
-- Name: tnld_contract_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.tnld_contract_reports_id_seq', 1, true);


--
-- Name: user_avatars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vna_user
--

SELECT pg_catalog.setval('public.user_avatars_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Wz80vv8xXFtdC5jG3Y3nHsTV2DNjsvUNTn422MKQKzTehltOeUOO5YuOeOrWEug

