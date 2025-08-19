import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { CgTranscript } from "react-icons/cg";
import { FaSearch, FaInfoCircle, FaGavel, FaShieldAlt } from "react-icons/fa";
import '../styles/tailwind.css';
import '../styles/home.css';

const Home = ({ detail, view, close, setclose, addtocart }) => {
    const [isAnimated, setIsAnimated] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInfraction, setSelectedInfraction] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Catégorisation des infractions
    const categorizeInfraction = (infraction) => {
        const loweredInfraction = infraction[0].toLowerCase();
        if (loweredInfraction.includes('vol')) return 'theft';
        if (loweredInfraction.includes('corruption')) return 'corruption';
        if (loweredInfraction.includes('cybercriminalité')) return 'cybercrime';
        if (loweredInfraction.includes('environnement')) return 'environment';
        if (loweredInfraction.includes('mœurs')) return 'morality';
        return 'other';
    };

    // Données des infractions (same as before)
    const infractions = [
        ["Abandon - délaissement d’un enfant incapable de se protéger", "Articles 348 à 351"],
        ["Abandon de famille", "Ordonnance n° 60-025, Articles 1er et 3"],
        ["Abattage d’arbre", "Articles 445 et 455"],
        ["Abus de besoin des mineurs", "Article 406"],
        ["Abus de blanc-seing", "Article 407"],
        ["Abus de confiance", "Articles 406, 408"],
        ["Abus de fonction", "Articles 166 à 198"],
        ["Administration de substances nuisibles à la santé", "Articles 41, 179.1"],
        ["Assassinat", "Articles 295 et 304"],
        ["Association de malfaiteurs", "Article 47"],
        ["Atteinte à la propriété", "Article 49"],
    ["Atteinte aux mœurs : attentat à la pudeur", "Article 53"],
    ["Atteinte aux mœurs : outrage public à la pudeur", "Article 59"],
    ["Atteinte aux mœurs : viol", "Article 61"],
    ["Attroupement illicite", "Article 65"],
    ["Avortement", "Article 71"],
    ["Banqueroute et infractions assimilées : agent de change coupable de banqueroute frauduleuse", "Article 75"],
    ["Banqueroute et infractions assimilées : agent de change coupable de banqueroute simple", "Article 79"],
    ["Banqueroute et infractions assimilées : infractions commises par le syndic", "Article 83"],
    ["Banqueroute et infractions assimilées : infractions commises par les parents du débiteur", "Article 87"],
    ["Banqueroute et infractions assimilées : infractions commises par les tiers", "Article 89"],
    ["Banqueroute et infractions assimilées : infractions commises par un créancier", "Article 95"],
    ["Banqueroute frauduleuse commise par les dirigeants ou représentants des personnes morales", "Article 101"],
    ["Banqueroute frauduleuse commise par les personnes physiques commerçantes", "Article 105"],
    ["Banqueroute simple commise par les personnes physiques commerçantes", "Article 107"],
    ["Banqueroute simple ou frauduleuse commise par les dirigeants des personnes morales", "Article 117"],
    ["Blanchiment de capitaux et financement du terrorisme", "Article 123"],
    ["Blessure et homicide involontaire", "Article 171"],
    ["Cadeaux illicites", "Article 175"],
    ["Concusions commises par les fonctionnaires publics : concussion commise par les personnes exerçant une fonction publique", "Article 179"],
    ["Concusions commises par les fonctionnaires publics : concussion des greffiers et des officiers ministériels", "Article 183"],
    ["Concusions commises par les fonctionnaires publics : exonérations et franchises illégales", "Article 187"],
    ["Conflit d’intérêts", "Article 191"],
    ["Contrefaçon des sceaux de l’État, des billets de banque, des effets publics", "Article 199"],
    ["Corruption active : corruption active des agents publics étrangers et de fonctionnaires d’organisations internationales publiques", "Article 205"],
    ["Corruption active : corruption active des personnes exerçant une fonction publique", "Article 211"],
    ["Corruption passive et active des dirigeants, actionnaires et des membres des professions libérales : corruption passive ou active d’un dirigeant ou d’un actionnaire d’une entreprise privée", "Article 219"],
    ["Corruption passive et active des dirigeants, actionnaires et des membres des professions libérales : corruption passive ou active d’un employé d’une entreprise privée", "Article 227"],
    ["Corruption passive et active des dirigeants, actionnaires et des membres des professions libérales : corruption passive ou active d’un membre d’une profession libérale", "Article 237"],
    ["Corruption passive : corruption passive des personnes exerçant une fonction publique", "Article 245"],
    ["Corruption passive : personne morale, auteur ou co-auteur ou complice ou instigateur ou bénéficiaire de corruption passive des personnes exerçant une fonction publique", "Article 249"],
    ["Coups et blessures volontaires", "Articles 253 à 261"],
    ["Coups mortels", "Article 261"],
    ["Crime de destruction des biens de l’État", "Article 263"],
    ["Crimes et délit contre la sûreté intérieure de l’État", "Article 265"],
    ["Crimes tendant à troubler l’État par la guerre civile", "Article 269"],
    ["Cybercriminalité : atteintes aux personnes physiques par le biais d’un système d’information", "Article 273"],
    ["Cybercriminalité : délits relatifs au système d’information", "Article 289"],
    ["Cybercriminalité : responsabilité pénale des opérateurs et prestataires chargés de l’exploitation des réseaux et services de télécommunications ou de communication électronique", "Article 299"],
    ["Défaut de déclaration de patrimoine", "Article 303"],
    ["Dénonciation abusive", "Article 305"],
    ["Déplacement ou suppression de bornes", "Article 309"],
    ["Destruction de biens d’autrui", "Article 311"],
    ["Destruction de canal d’irrigation - digue", "Article 313"],
    ["Destruction de clôture, déplacement ou suppression de limites d’une propriété", "Article 315"],
    ["Destruction de cultures", "Article 319"],
    ["Détention et séquestration", "Article 321"],
    ["Diffusion de l’image pornographique des mineurs", "Article 325"],
    ["Enlèvement - recel - suppression - substitution d’enfant", "Article 327"],
    ["Enlèvement de mineurs par fraude ou violence", "Article 331"],
    ["Enlèvement ou détournement de mineurs sans fraude ni violence", "Article 337"],
    ["Enrichissement illicite", "Article 341"],
    ["Escroquerie", "Article 347"],
    ["Évasion", "Article 351"],
    ["Exercice illégal de l’odonto-stomatologie", "Article 359"],
    ["Exercice illégal de la médecine et de l’acupuncture", "Article 363"],
    ["Exercice illégal de la profession d’aide sanitaire ou de tradipraticien", "Article 367"],
    ["Exercice illégal de la profession d’infirmier(e)", "Article 369"],
    ["Exercice illégal de la profession de masseur kinésithérapeute", "Article 371"],
    ["Exercice illégal de la profession de pharmacien", "Article 373"],
    ["Exercice illégal de la profession de sage-femme", "Article 375"],
    ["Fabrication, vente, colportage d’objets ou imprimés ressemblant aux imprimés officiels", "Article 379"],
    ["Fausse déclaration lors de l’inscription au Tableau de l’Ordre", "Article 383"],
    ["Fausse monnaie", "Article 385"],
    ["Faux en écriture privée", "Article 393"],
    ["Faux en écriture publique ou authentique et de commerce ou de banque", "Article 397"],
    ["Faux passeport - permis - carte d’identité - feuille de route - certificat", "Article 407"],
    ["Filouterie d’aliment", "Article 419"],
    ["Filouterie d’hôtel", "Article 421"],
    ["Filouterie de carburant ou de lubrifiant", "Article 423"],
    ["Filouterie de location de voiture", "Article 425"],
    ["Harcèlement sexuel", "Article 427"],
    ["Homicide volontaire", "Article 429"],
    ["Incendies volontaires", "Article 433"],
    ["Inexécution totale ou partielle de l’obligation du dépôt légal", "Article 439"],
    ["Infractions à l’ordonnance relative au recouvrement des avoirs illicites", "Article 443"],
    ["Infractions à la législation portant code de la pêche et de l’aquaculture", "Article 448"],
    ["Infractions à la loi sur la communication", "Article 485"],
    ["Infractions à la loi sur la concurrence", "Article 487"],
    ["Infractions à la loi sur les sociétés commerciales", "Article 513"],
    ["Infractions au code de gestion des aires protégées", "Article 537"],
    ["Infractions au code des changes", "Article 595"],
    ["Infractions aux lois sur l’inhumation", "Article 601"],
    ["Infractions aux règles concernant la conduite des véhicules : conduite en état d’ivresse", "Article 605"],
    ["Infractions aux règles concernant la conduite des véhicules : conduites sans permis", "Article 609"],
    ["Infractions aux règles concernant la conduite des véhicules : défaut d’assurance", "Article 613"],
    ["Infractions aux règles concernant la conduite des véhicules : délit de fuite", "Article 615"],
    ["Infractions aux règles concernant la conduite des véhicules : défaut de permis de conduire et conduite en état d’ivresse", "Article 617"],
    ["Infractions aux règles concernant la conduite des véhicules : refus d’obtempérer", "Article 619"],
    ["Infractions de mise en danger de l’environnement", "Article 621"],
    ["Infractions de mise en danger de l’environnement : Pollution industrielle", "Article 625"],
    ["Infractions en matière d’adoption", "Article 627"],
    ["Infractions par voie de communication médiatisée : atteinte à la vie privée", "Article 631"],
    ["Infractions par voie de communication médiatisée : atteinte au droit à l’image", "Article 635"],
    ["Infractions par voie de communication médiatisée : délits par voie de communication contre les personnes", "Article 635"],
    ["Infractions par voie de communication médiatisée : provocation aux crimes et aux délits", "Article 645"],
    ["Infractions par voie de communication médiatisée : publications interdites ou publications nécessitant une autorisation préalable", "Article 657"],
    ["Infractions relatives à la pollution industrielle", "Article 663"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : défaut de détention à bord d’un certificat d’assurance", "Article 667"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : non détention d’un plan de lutte contre l’événement de pollution", "Article 671"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : réception d’hydrocarbures à bord en l’absence de déclaration mensuelle", "Article 675"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : soustraction aux inspections périodiques de plan de lutte contre la pollution", "Article 677"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : soustraction par navire battant pavillon malagasy aux inspections périodiques de plan de lutte ou aux inspections environnementales des autres États", "Article 679"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : soustraction d’un navire à une visite de départ", "Article 681"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : violation par navire étranger des règles et normes environnementales dans la mer territoriale malagasy", "Article 683"],
    ["Infractions relatives à la protection de l’environnement marin et côtier contre pollution par déversement d’hydrocarbures : refus de déclaration d’identité et d’itinéraire à l’occasion de la commission d’infractions environnementales", "Article 685"],
    ["Infractions relatives aux activités de distribution et de vente", "Article 687"],
    ["Infractions relatives aux armes chimiques", "Article 689"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : acceptation de chèque sans provision", "Article 707"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : acceptation par banquier de chèque émis par tireur objet d’interdiction bancaire", "Article 709"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : contrefaçon ou falsification de carte bancaire - usage de carte bancaire falsifiée - acceptation de paiement par carte bancaire falsifiée", "Article 711"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : contrefaçon ou falsification de chèque - usage de chèque falsifié - acceptation de chèque falsifié", "Article 715"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : émission de chèque sans provision", "Article 719"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : omission de déclaration d’incidents de paiement (par le tiré)", "Article 721"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : opposition à paiement de chèque", "Article 723"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : refus illicite de paiement d’un chèque frappé d’opposition", "Article 725"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : retrait illicite de provision", "Article 727"],
    ["Infractions relatives aux chèques, aux cartes bancaires et de crédit, de retrait et de paiement : violation des mesures d’interdiction d’émettre des chèques par le tireur ou par le mandataire du tireur", "Article 729"],
    ["Infractions réprimées par le code des douanes", "Article 731"],
    ["Infractions réprimées par le code général des impôts", "Article 759"],
    ["Infractions réprimées par le code minier", "Article 825"],
    ["Importation, transformation, transport, stockage et vente des hydrocarbures : infractions dans le secteur pétrolier amont", "Article 863"],
    ["Importation, transformation, transport, stockage et vente des hydrocarbures : infractions dans le secteur pétrolier aval", "Article 877"],
    ["Infractions sur le régime des armements", "Article 897"],
    ["Ingérence dans des affaires ou commerces incompatibles avec la qualité : commerce incompatible avec la qualité", "Article 911"],
    ["Ingérence dans des affaires ou commerces incompatibles avec la qualité : favoritisme", "Article 915"],
    ["Ingérence dans des affaires ou commerces incompatibles avec la qualité : prise d’avantage injustifié", "Article 927"],
    ["Ingérence dans des affaires ou commerces incompatibles avec la qualité : prise d’emploi prohibé", "Article 933"],
    ["Levée / commandement de troupes armées / usage de la force publique sans autorisation de l’autorité légitime", "Article 945"],
    ["Menaces contre les personnes ou de destruction des biens", "Article 949"],
    ["Non révélation de crimes compromettant la sûreté intérieure ou extérieure de l’État", "Article 955"],
    ["Proxénétisme", "Article 957"],
    ["Rassemblement illicite", "Article 961"],
    ["Rébellion", "Article 965"],
    ["Représailles", "Article 971"],
    ["Résistance à l’exécution d’une décision judiciaire définitive", "Article 975"],
    ["Révélation de l’identité d’un témoin anonyme", "Article 977"],
    ["Soustraction de documents produits dans une contestation judiciaire", "Article 979"],
    ["Soustractions commises par les dépositaires publics : détournement de biens publics", "Article 981"],
    ["Soustractions commises par les dépositaires publics : détournement de biens privés", "Article 989"],
    ["Stellionat", "Article 995"],
    ["Stupéfiants, substances psychotropes et précurseurs", "Article 997"],
    ["Terrorisme et criminalité transnationale organisée", "Article 1019"],
    ["Torture ou traitements cruels, inhumains ou dégradants", "Article 1055"],
    ["Trafic d’influence", "Article 1065"],
    ["Traite des êtres humains", "Article 1075"],
    ["Vagabondage", "Article 1105"],
    ["Violation de domicile", "Article 1107"],
    ["Vol de bovidés", "Article 1109"],
    ["Vol de récolte sur pied", "Article 1117"],
    ["Vol de vanille", "Article 1119"],
    ["Vol simple, vol aggravé : Vol aggravé", "Article 1121"],
        // Ajoutez toutes les autres infractions ici...
        ["Vol simple, vol aggravé : Vol simple", "Article 1131"],
    ];


    // Filtrer les infractions
    const filteredInfractions = infractions.filter(infraction => 
        (searchTerm === '' || 
            infraction[0].toLowerCase().includes(searchTerm.toLowerCase()) || 
            infraction[1].toLowerCase().includes(searchTerm.toLowerCase())
        ) && 
        (categoryFilter === 'all' || categorizeInfraction(infraction) === categoryFilter)
    );

    // Ouvrir les détails de l'infraction
    const handleInfractionDetails = (infraction) => {
        setSelectedInfraction(infraction);
        setModalOpen(true);
    };

    // Catégories de filtrage
    const categories = [
        { value: 'all', label: 'Toutes les infractions', icon: <FaShieldAlt /> },
        { value: 'theft', label: 'Vols', icon: <FaGavel /> },
        { value: 'corruption', label: 'Corruption', icon: <FaInfoCircle /> },
        { value: 'cybercrime', label: 'Cybercriminalité', icon: <FaShieldAlt /> },
        { value: 'environment', label: 'Infractions environnementales', icon: <FaGavel /> },
        { value: 'morality', label: 'Atteintes aux mœurs', icon: <FaInfoCircle /> },
    ];

    return (
        <>
            <Container className="search-container">
                {/* Barre de recherche */}
                <div className="flex items-center my-4 max-w-lg mx-auto bg-blue-700 rounded-lg overflow-hidden shadow-md">
                    <FaSearch size={24} className="text-gray-400 ml-3 mr-2 p-1" />
                    <input
                        type="text"
                        placeholder="Rechercher une infraction ou référence pénale"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                </div>

                {/* Filtres de catégories */}
                <div className="flex justify-center space-x-2 mb-4">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setCategoryFilter(category.value)}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                categoryFilter === category.value 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-blue-600'
                            }`}
                        >
                            {category.icon}
                            <span className="ml-2 text-sm">{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* Section de la Table des infractions */}
                <Container className="about bg-blue-700 text-white mt-2 pt-1">
                    <div className="box text-center mb-4">
                        <div className="icon text-white">
                            <CgTranscript className="text-3xl" />
                        </div>
                        <Typography variant="h5" className="font-bold">TABLE DES INFRACTIONS</Typography>
                    </div>
                </Container>

                {/* Table des infractions */}
                <Container>
                    <TableContainer component={Paper} className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header-cell bg-green-700 text-gray-200 text-lg font-semibold border-b-2 border-blue-700">
                                        Infraction
                                    </TableCell>
                                    <TableCell className="table-header-cell bg-green-700 text-gray-200 text-lg font-semibold border-b-2 border-blue-700">
                                        Code Pénal
                                    </TableCell>
                                    <TableCell className="table-header-cell bg-green-700 text-gray-200 text-lg font-semibold border-b-2 border-blue-700">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInfractions.map((infraction, index) => (
                                    <TableRow key={index} className="hover:bg-blue-600 transition-colors duration-200">
                                        <TableCell className="border-b border-blue-700 text-blue-300 p-4">
                                            {infraction[0]}
                                        </TableCell>
                                        <TableCell className="border-b border-blue-700 text-blue-300 p-4">
                                            {infraction[1]}
                                        </TableCell>
                                        <TableCell className="border-b border-blue-700 p-4">
                                            <button 
                                                onClick={() => handleInfractionDetails(infraction)}
                                                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors duration-300"
                                            >
                                                Détails
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Container>

            {/* Modal de détails de l'infraction */}
            <Dialog 
                open={modalOpen} 
                onClose={() => setModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: '#1e293b', // bg-slate-800
                        color: '#ffffff'
                    }
                }}
            >
                {selectedInfraction && (
                    <>
                        <DialogTitle className="bg-blue-700 text-white">
                            <div className="flex items-center">
                                <FaGavel className="mr-3" />
                                Détails de l'Infraction
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className="space-y-4 p-4">
                                <Typography variant="h6" className="text-blue-300">
                                    {selectedInfraction[0]}
                                </Typography>
                                <Typography variant="body1" className="text-gray-300">
                                    Référence légale : {selectedInfraction[1]}
                                </Typography>
                                <div className="bg-blue-900 p-3 rounded-lg">
                                    <Typography variant="subtitle1" className="text-green-300 mb-2">
                                        Informations supplémentaires
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-200">
                                        Veuillez consulter le code pénal complet pour les détails précis concernant 
                                        les sanctions et les circonstances spécifiques de cette infraction.
                                    </Typography>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                onClick={() => setModalOpen(false)} 
                                color="primary"
                                className="text-white bg-red-600 hover:bg-red-700"
                            >
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default Home;