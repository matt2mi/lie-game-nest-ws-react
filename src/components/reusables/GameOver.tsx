import * as React from 'react';

interface Props {
    readonly rank: number;
    readonly total: number;
}

interface State {
}

export default class GameOver extends React.Component<Props, State> {
    babySuccess = require('../../memes/baby-success.jpg');
    itsOkBro = require('../../memes/itsokbro.jpg');
    guessWho = require('../../memes/guess-whos-loser-obama.jpg');
    huskieScared = require('../../memes/husky-scared.jpg');
    vanPersieFail = require('../../memes/van-persie-fail.gif');
    careySuccess = require('../../memes/carey-success.gif');
    pokemonSuccess = require('../../memes/pokemon-success.gif');

    currentPic = null;
    frenchRank = '';

    constructor(props: Props) {
        super(props);

        const ratio = props.rank / props.total;

        if (props.rank === 1) {
            this.currentPic = this.careySuccess;
        } else if (props.rank === 2) {
            this.currentPic = this.pokemonSuccess;
        } else if (props.rank === 3) {
            this.currentPic = this.babySuccess;
        } else {
            this.currentPic =
                ratio < 0.52 ? this.itsOkBro :
                    0.52 < ratio && ratio < 0.69 ? this.guessWho :
                        0.69 < ratio && ratio < 0.86 ? this.huskieScared :
                            this.vanPersieFail;
        }

        this.frenchRank = props.rank === 1 ?
            '1er - ' : props.rank === 2 ?
                '2ème - ' : props.rank === 3 ?
                    '3ème - ' : '';
    }

    render() {
        return (
            <div className="base-div-content">
                <div className="row justify-content-center">
                    <div className="col-sm-10">
                        <h1>!! Tu finis {this.frenchRank + ' sur ' + this.props.total} !!</h1>
                        <img width="100%" src={this.currentPic}/>
                    </div>
                </div>
            </div>
        );
    }
}