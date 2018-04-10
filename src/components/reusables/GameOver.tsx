import * as React from 'react';

interface Props {
    readonly rank: number;
    readonly total: number;
}

interface State {
}

export default class GameOver extends React.Component<Props, State> {
    happyHuskies = require('../../memes/happy-singin-huskies.jpg');
    babySuccess = require('../../memes/baby-success.jpg');
    itsOkBro = require('../../memes/itsokbro.jpg');
    guessWho = require('../../memes/guess-whos-loser-obama.jpg');
    careyLoser = require('../../memes/carey-loser.jpg');
    huskieScared = require('../../memes/husky-scared.jpg');

    currentPic = null;

    constructor(props: Props) {
        super(props);

        const ratio = this.props.rank / this.props.total;

        this.currentPic =
            ratio < 0.16 ? this.happyHuskies :
                ratio < 0.32 && ratio > 0.16 ? this.babySuccess :
                    ratio < 0.48 && ratio > 0.32 ? this.itsOkBro :
                        ratio < 0.64 && ratio > 0.48 ? this.guessWho :
                            ratio < 0.80 && ratio > 0.64 ? this.careyLoser :
                                this.huskieScared;
    }

    render() {
        return (
            <div className="base-div-content">
                <div className="row justify-content-center">
                    <div className="col-sm-10">
                        <h1>!! Terminé !!</h1>
                        <img width="100%" src={this.currentPic}/>
                    </div>
                </div>
            </div>
        );
    }
}