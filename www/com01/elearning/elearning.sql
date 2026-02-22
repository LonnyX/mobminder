/*
 Navicat MySQL Data Transfer

 Source Server         : com01
 Source Server Type    : MySQL
 Source Server Version : 50735
 Source Host           : localhost:3306
 Source Schema         : elearning

 Target Server Type    : MySQL
 Target Server Version : 50735
 File Encoding         : 65001

 Date: 07/12/2022 12:33:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for xlations
-- ----------------------------
DROP TABLE IF EXISTS `xlations`;
CREATE TABLE `xlations`  (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tn` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `page` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fr` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `en` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nl` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1759 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of xlations
-- ----------------------------
INSERT INTO `xlations` VALUES (1668, 'top_header_l2', 'index', 'Agenda professionnel', 'Professional agenda', 'Professionele agenda');
INSERT INTO `xlations` VALUES (1667, 'top_header_l3', 'index', 'Plateforme e-learning', 'E-learning platform', 'E-learning platform');
INSERT INTO `xlations` VALUES (1669, 'top_menu_1', 'index', 'Agenda single', 'Single agenda', 'Single agenda');
INSERT INTO `xlations` VALUES (1670, 'top_menu_2', 'index', 'Multi agenda', '', 'Multi agenda');
INSERT INTO `xlations` VALUES (1671, 'top_menu_3', 'index', 'Agenda mobile', 'Mobile agenda', 'Mobiele agenda');
INSERT INTO `xlations` VALUES (1672, 'main_title', 'single', 'Agenda single', 'Single agenda', 'Single agenda');
INSERT INTO `xlations` VALUES (1673, 'basics', 'single', 'Notions de base', 'Basic notions', 'Basisconcepten');
INSERT INTO `xlations` VALUES (1674, 'single_01_01', 'single', 'Ajouter un visiteur', 'Add a visitor', 'Bezoeker toevoegen');
INSERT INTO `xlations` VALUES (1675, 'single_01_02', 'single', 'Ajouter un rendez-vous via l\'assistant de recherche', 'Add a visitor using the search assistance tool', 'Een afspraak toevoegen met de zoekassistent');
INSERT INTO `xlations` VALUES (1676, 'single_01_03', 'single', 'Ajouter un rendez-vous', 'Add an appointment', 'Een afspraak toevoegen');
INSERT INTO `xlations` VALUES (1677, 'single_01_04', 'single', 'Retrouver les rendez-vous d\'un visiteur', 'Find appointments of a visitor', 'Afspraken van een bezoeker zoeken');
INSERT INTO `xlations` VALUES (1678, 'single_01_05', 'single', 'Supprimer un rendez-vous', 'Delete an appointment', 'Een afspraak verwijderen');
INSERT INTO `xlations` VALUES (1679, 'single_01_06', 'single', 'Prendre une après-midi de congé', 'Take a half day off ', 'Neem een namiddag vrij');
INSERT INTO `xlations` VALUES (1680, 'single_01_07', 'single', 'Prendre une semaine de congé', 'Take a week off', 'Een of meerdere volledige dagen conge nemen');
INSERT INTO `xlations` VALUES (1681, 'single_01_08', 'single', 'Accéder à la vue hebdomadaire', 'See the weekly view', 'De week zicht zien');
INSERT INTO `xlations` VALUES (1682, 'single_01_09', 'single', 'Accéder à la vue en liste (et l\'imprimer)', 'Access to the list view  (and print it)', 'Een planning printen');
INSERT INTO `xlations` VALUES (1683, 'single_01_10', 'single', 'A retirer :  Trouver le lien de synchronisation', '', '');
INSERT INTO `xlations` VALUES (1684, 'single_01_11', 'single', 'Changer les accès', 'Change a password', 'Login wijzigen\n');
INSERT INTO `xlations` VALUES (1685, 'single_01_12', 'single', 'Fermer sa session', 'Log out', 'Uitloggen');
INSERT INTO `xlations` VALUES (1687, 'single_02_01', 'single', 'Changer les détails d\'affichage', 'Change display details', 'Weergavedetails wijzigen');
INSERT INTO `xlations` VALUES (1688, 'single_02_02', 'single', 'Replanifier un rendez-vous', 'Reschedule an appointment ', 'Een afspraak herplannen');
INSERT INTO `xlations` VALUES (1689, 'single_02_04', 'single', 'Changer la couleur des étiquettes de rendez-vous', 'Change the appointments stickers\' color ', 'Een kleur kiezen voor stickers op de planning');
INSERT INTO `xlations` VALUES (1690, 'single_02_03', 'single', 'Dupliquer un rendez-vous', 'Duplicate an appointment', 'Een afspraak dupliceren');
INSERT INTO `xlations` VALUES (1691, 'single_02_05', 'single', 'Créer une couleur de RDV', 'Create a custom color for special appointments', 'Speciale kleuren maken voor afspraken');
INSERT INTO `xlations` VALUES (1692, 'single_02_06', 'single', 'Créer une couleur de visiteur', 'Create a custom color to identify certain visitors', 'Kleuren bepalen voor bijzondere bezoekers');
INSERT INTO `xlations` VALUES (1693, 'single_02_07', 'single', 'Appliquer des tags ou qualifier vos visiteurs', 'Put tags or qualify visitors', 'Icoontjes of tags toepassen op bezoekers');
INSERT INTO `xlations` VALUES (1694, 'single_02_08', 'single', 'Créer une couleur de congé', 'Create custom colors for holidays and off days', 'Kleuren maken voor diverse types van congés');
INSERT INTO `xlations` VALUES (1695, 'single_02_09', 'single', 'Définir des prestations de rendez-vous ', 'Define recurrent performances (e.g. usual cares)', 'Terugkerende optredens definiëren');
INSERT INTO `xlations` VALUES (1696, 'single_02_10', 'single', 'Fusionner un visiteur encodé deux fois', 'Merge a visitor who has been double encoded', 'Hoe maak je een bezoeker die dubbel gecodeerde was');
INSERT INTO `xlations` VALUES (1697, 'single_02_11', 'single', 'Elargir la plage horaire affichée', 'Expand the planning hours span', 'Hoe wordt de planning weergegeven tijd uitgebreden');
INSERT INTO `xlations` VALUES (1698, 'medium', 'single', 'Notions avancées', 'Advanced notions', 'Geavanceerde concepten');
INSERT INTO `xlations` VALUES (1699, 'hourly', 'single', 'Gestion horaires', 'Schedule management', 'Schema beheer');
INSERT INTO `xlations` VALUES (1700, 'single_03_01', 'single', 'Changer l\'heure de début et de fin d\'une journée', 'Change the start and end work time of a day ', 'De begin- en eindtijd van een werkdag wijzigen');
INSERT INTO `xlations` VALUES (1701, 'single_03_02', 'single', 'Insérer/supprimer une pause dans la journée', 'Insert/delete a break in a work day', 'Een break in een werk dag plaatsen/verwijderen');
INSERT INTO `xlations` VALUES (1702, 'single_03_03', 'single', 'Fermer/ouvrir une journée de la semaine', 'Close/open a week day', 'Een weekdag volledig afsluiten of opendoen');
INSERT INTO `xlations` VALUES (1703, 'single_03_04', 'single', 'Changer l\'horaire à partir d\'une date future', 'Change the hourly schedule from a specific date', 'Hoe schakelen naar een nieuw uurrooster vanaf een bepaalde datum');
INSERT INTO `xlations` VALUES (1704, 'single_03_05', 'single', 'Changer l\'horaire pour un seul jour', 'Adjust the time range for one day', 'Een uitzonderlijk uurrooster invoegen op een bepaalde kalender datum');
INSERT INTO `xlations` VALUES (1705, 'single_03_06', 'single', 'Ouvrir une plage horaire exceptionnelle', 'Insert an exceptional hourly schedule', 'Een uitzonderlijk tijdslot openen');
INSERT INTO `xlations` VALUES (1706, 'single_03_07', 'single', 'Changer les couleurs des languettes de l\'horaire', 'Change the colors of the hourly tabs', 'De kleuren van de tabbladen van de uurrooster veranderen');
INSERT INTO `xlations` VALUES (1707, 'expert', 'single', 'Réglages et préférences', 'Settings and preferences', 'Instellingen en voorkeuren');
INSERT INTO `xlations` VALUES (1708, 'single_04_01', 'single', 'Créer un RDV avec plusieurs visiteurs', 'Have more than one visitor in a unique appointment', 'Meerdere bezoekers in een afspraak maken');
INSERT INTO `xlations` VALUES (1709, 'single_04_02', 'single', 'Utiliser la liste d\'urgences', 'Use the waiting list', 'De lijst van noodgevallen gebruiken');
INSERT INTO `xlations` VALUES (1710, 'single_04_03', 'single', 'Etablir un horaire tournant sur plusieurs semaines', 'Set up an hourly that rotates over 2 weeks or more', 'Opzetten van een uurrooster dat op 2 weken of meer draait.');
INSERT INTO `xlations` VALUES (1711, 'single_04_04', 'single', 'Changer le message du SMS', 'Change the SMS message', 'Het SMS-bericht wijzigen');
INSERT INTO `xlations` VALUES (1712, 'single_04_05', 'single', 'Changer le timing du SMS', 'Change the timing of the automated sending', 'De timing van de SMS wijzigen');
INSERT INTO `xlations` VALUES (1713, 'single_04_06', 'single', 'Changer le message de l\'email', 'Change the text of automated emails', 'Het e-mailbericht wijzigen');
INSERT INTO `xlations` VALUES (1714, 'single_04_07', 'single', 'Envoyer un SMS dans la langue du visiteur', 'Send SMS in the visitor\'s language', 'Een SMS versturen in de taal van de bezoeker');
INSERT INTO `xlations` VALUES (1715, 'single_04_08', 'single', 'Créer un accès', 'How to give access to a new colleague', 'Een toegang creëren\n');
INSERT INTO `xlations` VALUES (1716, 'single_04_09', 'single', 'Savoir qui a crée/modifié un RDV', 'Track who has inserted/changed an appointment', 'Weten wie een afspraak heeft gemaakt of gewijzigd');
INSERT INTO `xlations` VALUES (1717, 'single_04_10', 'single', 'Savoir qui a supprimé le RDV', 'Track who has deleted an appointment', 'Ontdek wie de afspraak heeft verwijderd');
INSERT INTO `xlations` VALUES (1718, 'timeBoxing', 'single', 'Blocs horaires', 'Time blocks', '');
INSERT INTO `xlations` VALUES (1719, 'single_05_01', 'single', 'Je travaille à deux endroits différents (ou plus)', 'I work in several locations', 'Ik werk op twee veeschillende plaatsen en het moet op de planning voorkomen');
INSERT INTO `xlations` VALUES (1720, 'single_05_02', 'single', 'Gestion du temps de travail (bloc et hors bloc)', 'Using block and out of block time management concept', 'Ik wil time boxing gebruiken volgens time management concepten');
INSERT INTO `xlations` VALUES (1721, 'eResa', 'single', 'Réservation en ligne', 'Online booking', 'Online afsprakenbeheer');
INSERT INTO `xlations` VALUES (1722, 'single_06_01', 'single', 'Créer ma page personnelle de réservation en ligne', 'Set up your own booking web page', 'Mijn persoonlijke online reserveringspagina maken');
INSERT INTO `xlations` VALUES (1723, 'single_06_02', 'single', 'Définir des prestations de rendez-vous en ligne', 'Make a subset of your performances to be web-reservable', 'Definiëren van online afsprakendiensten/prestaties');
INSERT INTO `xlations` VALUES (1724, 'single_06_03', 'single', 'Autoriser les prestations web dans certaines plages horaires', 'Allow web reservations in certain time slots', 'Autoriseer webservices in bepaalde tijdvakken');
INSERT INTO `xlations` VALUES (1725, 'single_06_04', 'single', 'Donner une couleur ou un motif pour les RDV pris par le web', 'Give a special color or pattern to appointments taken online', 'Speciale kleuren of patronen aanmaken voor afspraken die via de web genomen worden');
INSERT INTO `xlations` VALUES (1726, 'main_title', 'multi', 'Agendas multiples', '', '');
INSERT INTO `xlations` VALUES (1727, 'basics', 'multi', 'Actions basiques', '', '');
INSERT INTO `xlations` VALUES (1728, 'multi_03_08', 'multi', 'Partager le même horaire entre collègues', 'Share the same hourly schedule with other colleagues', 'Dezelfde agenda delen met collega\'s');
INSERT INTO `xlations` VALUES (1729, 'multi_04_11', 'multi', 'Limiter les agendas visibles', 'Set callendars visibility', '');
INSERT INTO `xlations` VALUES (1730, 'multi_04_12', 'multi', 'Passer un rendez-vous sur un autre agenda', 'Move an appointments to another calendar', 'Een afspraak verplaatsen naar een andere agenda');
INSERT INTO `xlations` VALUES (1731, 'slogan_1', 'main', 'Moins cher qu\'un RDV oublié, plus rentable qu\'un agenda ordinaire', 'Mobminder cheaper than a forgotten appointment, more profitable than any ordinary agenda', 'Mobminder goedkoper dan een vergeten afspraak, voordeliger dan een gewone kalender');
INSERT INTO `xlations` VALUES (1732, 'address_l1', 'main', 'Cloud-Tech SRL', '', '');
INSERT INTO `xlations` VALUES (1733, 'address_l4', 'main', 'rue du Brillant 86/21', '', '');
INSERT INTO `xlations` VALUES (1734, 'address_l5', 'main', '1170 Brussels', '', '');
INSERT INTO `xlations` VALUES (1735, 'address_l6', 'main', 'Belgium - Europe', '', '');
INSERT INTO `xlations` VALUES (1736, 'address_l7', 'main', 'Tax id BCE BE 0565.946.696', '', '');
INSERT INTO `xlations` VALUES (1737, 'invite_play_video', 'footer', 'Démarrez cette vidéo pour découvrir qui nous sommes...', 'Start this video to discover who we are...', 'Start deze video om te ontdekken wie we zijn...');
INSERT INTO `xlations` VALUES (1738, 'thanks_play_video', 'footer', 'Merci et enchanté de faire votre connaissance. De la part de l\'équipe Mobminder.', 'Thank you and nice to meet you. On behalf of the Mobminder team.', 'Dank u en aangenaam kennis met u te maken door de Mobminder team');
INSERT INTO `xlations` VALUES (1739, 'main_title', 'touch', 'Agenda mobile', '', 'Mobiele agenda');
INSERT INTO `xlations` VALUES (1740, 'main_subtitle', 'touch', 'Consultez la vidéo ci-dessous pour découvrir nos conseils d\'utilisation', 'Play the video below to see our tips for use', 'Bekijk de video hieronder om over de smartphone of tablet applicatie te leren');
INSERT INTO `xlations` VALUES (1741, 'touch_instruction1', 'touch', 'Balayer l\'écran dans la zone centrale ou balayer le bandeau supérieur pour naviguer dans l\'agenda', 'Swipe the screen in the central area or swipe the top banner to navigate through the agenda', 'Sleep uw vinger naar de rechter- of linkerkant in het midden van het scherm of de bovenste banner om doorheen de kalender te navigeren');
INSERT INTO `xlations` VALUES (1742, 'touch_instruction2', 'touch', 'Un appui long sur le bandeau supérieur montre un aperçu de votre semaine', 'A long press on the top banner shows an overview of your week', 'Een lange druk op de top banner toont een overzicht van uw week');
INSERT INTO `xlations` VALUES (1743, 'touch_instruction3', 'touch', 'Toucher deux fois le centre de l\'écran pour revenir à la date du jour', 'Touch the center of the screen twice to return to the current date', 'Druk tweemaal op het midden van het scherm om terug te keren naar de huidige datum');
INSERT INTO `xlations` VALUES (1752, 'touch_instruction4', 'touch', 'Sur la vue de planning, toucher à deux doigts au centre de l\'écran pour zoomer', 'On the planning view, touch the center of the screen with two fingers to zoom in', 'Om in te zoomen in het planningsoverzicht tikt u met twee vingers in het midden van het scherm');
INSERT INTO `xlations` VALUES (1746, 'touch_instruction5', 'touch', 'Un appui long au centre de l\'écran fait apparaître les RDVs effacés', 'A long press in the center of the screen displays the deleted appointments', 'Druk lang in het midden van het scherm om de gewiste afspraken te tonen');
INSERT INTO `xlations` VALUES (1747, 'touch_instruction6', 'touch', 'Toucher une zone libre ou une étiquette de RDV pour ouvrir un RDV', 'Touch a free zone or an appointment label to open an appointment', 'Tik op een vrije zone of op een afspraak sticker om een afspraak te maken of te openen');
INSERT INTO `xlations` VALUES (1748, 'touch_instruction7', 'touch', 'Toucher le symbole <i class=\"fa fa-user-plus mob-txt-lime\"></i> pour ajouter ou sélectionner un patient/client dans votre registre', 'Touch the icon <i class=\"fa fa-user-plus mob-txt-lime\"></i> to add or select a patient/client in your register', 'Tik op het icoon <i class=\"fa fa-user-plus mob-txt-lime\"></i> om een patiënt/cliënt van uw register te selecteren of toe te voegen');
INSERT INTO `xlations` VALUES (1749, 'touch_instruction8', 'touch', 'Un appui long sur le patient/client sélectionné permet d\'appeler, d\'envoyer un email ou un SMS', 'A long press on the selected patient/client allows to call, send an email or an SMS', 'Een lange druk op de geselecteerde patiënt/cliënt laat u toe om te bellen of een e-mail/een SMS te versturen');
INSERT INTO `xlations` VALUES (1750, 'touch_instruction9', 'touch', 'Tirer le bord gauche de l\'écran pour accéder aux options supplémentaires (registre visiteurs, passer sur un autre agenda, se déconnecter)', 'Drag the left side of the screen to access additional options (guestbook, switch to another schedule, log out)', 'Sleep uw vinger in de linkerkant van het scherm om extra opties te openen (gastenboek, overschakelen naar een ander rooster, uitloggen)');
INSERT INTO `xlations` VALUES (1751, 'touch_instruction10', 'touch', 'Balayer la zone basse de l\'écran pour passer au calendrier annuel ou revenir à la vue du jour', 'Swipe the bottom area of the screen to move to the annual calendar or return to the day view', 'Swipe het onderste gedeelte van het scherm om naar de jaarkalender over te schakelen of naar de dagweergave terug te keren');
INSERT INTO `xlations` VALUES (1753, 'download_now', 'touch', 'Télécharger l\'application', 'Download the app', 'Download de app');
INSERT INTO `xlations` VALUES (1754, 'availability1', 'touch', 'Disponible sur', 'Get it on', 'Ontdek het op');
INSERT INTO `xlations` VALUES (1755, 'availability2', 'touch', 'Disponible sur', 'Available on the', 'Verkrijgbaar in de');
INSERT INTO `xlations` VALUES (1756, 'qr_code_payment', 'touch', 'Paiement par QR code', 'Payment by QR code', 'Betaling met QR-code');
INSERT INTO `xlations` VALUES (1757, 'pageDescription', 'index', 'Découvrez nos vidéos e-learning grâce auxquelles vous maitriserez les fonctionnalités les plus simples et les plus avancées de votre agenda Mobminder', 'Discover our e-learning videos which will help you to master the simplest and most advanced features of your Mobminder agenda', 'Bekijk onze e-learning video\'s die u zullen helpen de meest eenvoudige en geavanceerde mogelijkheden van uw Mobminder agenda onder de knie te krijgen');

SET FOREIGN_KEY_CHECKS = 1;
