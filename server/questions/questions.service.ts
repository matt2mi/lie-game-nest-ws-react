import { Question } from '../types';

export class QuestionsService {
    questions: Question[];
    currentQuestionId: number;
    allreadyAskedId: Array<number>;

    constructor() {
        this.questions = [
            {
                text: 'El colacho est un festival espagnol où les gens s\'habillent en diables et sautent au dessus de ...',
                answers: ['bébés', 'bebes', 'bébé', 'bebe'],
                lies: ['voitures', 'piscines', 'canapés', 'haies', 'chaussures']
            }, {
                text: 'Dans la ville d\'Alliance au Nebraska, on peut voir une réplique du Stonehenge faite de ...',
                answers: ['voiture', 'voitures'],
                lies: ['crottes', 'patates', 'kaplas', 'coussins', 'chaises']
            }, {
                text: 'En vacances en chine à Dongyang, il faut absolument goûter leurs oeufs cuits dans ...',
                answers: ['l\'urine d\'enfant', 'urine d\'enfant', 'urine enfant', 'urine'],
                lies: ['du liquide amniotique', 'du lait de panda', 'une sauce piment', 'du fromage', 'un wok']
            }, {
                text: 'Nicolas Ancion a écrit un livre sur un pays imaginaire dont le titre est "Les ours n\'ont pas de ' +
                'problème de ..."',
                answers: ['parking'],
                lies: ['mycose', 'température', 'transit', 'fourrure', 'dentition']
            }, {
                text: 'Zakhar Prilepine a écrit un livre de nouvelles comiques dont le titre est "Des chaussures pleines ' +
                'de ... chaud(es)"',
                answers: ['vodka'],
                lies: ['pisse', 'boue', 'merde', 'poils', 'chocolat']
            }, {
                text: 'Quand l\'auteur de Charlie et la chocolaterie, Roald Dahl est mort, il a été enterré avec des ' +
                'queues de billard, du vin de Bourgogne, du chocolat, des crayons et ...',
                answers: ['une scie électrique', 'scie'],
                lies: ['sa chienne', 'un globe terrestre', 'ses chaussettes', 'une griffe de corbeau', 'des livres']
            }, {
                text: 'Le 22 mai 2012, Lindsay Lohan a tweeté : "... est le meilleur médicament."',
                answers: ['le travail'],
                lies: ['la drogue', 'le sexe', 'un gosse', 'un mari', 'zouk la']
            }, {
                text: 'Mohammed Khurshid Hussain est dans le livre des records car il arrive à ... très vite avec son nez',
                answers: ['taper au clavier', 'taper', 'écrire'],
                lies: ['siffler', 'souffler', 'sniffer', 'manger', 'lire']
            }, {
                text: 'Le New York Times a éét obligé de corriger une édition pour avoir pris Mario et Luigi (Nintendo) ' +
                'comme ... plutôt que plombiers',
                answers: ['concierges', 'concierge'],
                lies: ['électriciens', 'charpentiers', 'sportifs', 'flics', 'gardiens']
            }, {
                text: 'La ville d\'Olney dans l\'Illinois (USA) organise un évènement annuel pour ... les écureuils',
                answers: ['compter'],
                lies: ['honorer', 'empailler', 'faire manger', 'tondre', 'observer']
            }, {
                text: 'Dans les années 90, les profs en Corée du Nord devaient savoir à peu près comment ...',
                answers: ['jouer de l\'accordéon'],
                lies: ['écrire leur nom', 'cuisiner', 'accoucher dans l\'eau', 'parler anglais', 'tirer au pistolet']
            }, {
                text: 'D\'après une étude de l\'université de Jena, on se rapelle plus facilement des gens ...',
                answers: ['moches'],
                lies: ['cons', 'étrangers', 'chiants', 'charmants', 'différents']
            }, {
                text: 'La cause de la mort d\'un cascadeur pendant qu\'il traversait une rivière sur une tyrolienne avec ' +
                'sa queue de cheval',
                answers: ['attaque cardiaque', 'cardiaque'],
                lies: ['scalpé', 'perte de sang', 'froid', 'chute']
            }, {
                text: 'Coca-Cola a, un jour, commandé un jeu vidéo sur Atari nommé "Pepsi ..."',
                answers: ['invaders'],
                lies: ['parade', 'sports', 'co', 'pop', 'sip']
            }
        ];
        this.currentQuestionId = Math.floor(Math.random() * this.questions.length);
        this.allreadyAskedId = [this.currentQuestionId];
    }

    getQuestion(): Question {
        return this.questions[this.currentQuestionId];
    }

    getAnswers(): string[] {
        return this.questions[this.currentQuestionId].answers;
    }

    getLies(): string[] {
        return this.questions[this.currentQuestionId].lies;
    }

    nextQuestion(): void {
        this.currentQuestionId = Math.floor(Math.random() * this.questions.length);
        if (this.allreadyAskedId.some((id) => id === this.currentQuestionId)) {
            return this.nextQuestion();
        }
        this.allreadyAskedId.push(this.currentQuestionId);
    }

    endOfRound() {
        this.allreadyAskedId = [];
    }
}

// autre : https://www.youtube.com/watch?v=Wzt4pygZWwA
