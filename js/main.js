/**
* main.js
* author: Irakli Zarandia. (PiraTa)
* mail: zarandia.irakli@gmail.com
*/
'use strict';
(function(window, document){

    var TicTacToe = function(){
        this.spaces   = [];

        this.turn     = 'X';
        this.scores   = {'X': 0, 'O': 0};

        this.board    = new Board(this);
        this.createGrid();
    };

    TicTacToe.prototype.createGrid = function(){
        var startX = 20;
        var startY = 20;
        var scores = 1;

        for(var y = 0; y < 3; y++){
            startY = 150 * y + ((15 * (y+1)) || 15);
            this.spaces[y] = [];
            for(var x = 0; x < 3; x++){
                startX = 150 * x + ((15 * (x+1)) || 15);
                this.spaces[y][x] = {cords: [startX, startY], used: false, player: null, scoresIndicator: scores};
                this.board.drawTile(startX, startY);
                scores += scores;
            }
        }
    }

    TicTacToe.prototype.isValidTale = function(xx, yy, tobool){
        for(var i = 0; i < 3; i++){
            var x = this.spaces[i];
            for(var j = 0; j < 3; j++){
                var obj     = x[j];
                var cords   = obj.cords;

                if(xx >= cords[0] && xx <= cords[0] + 150 && yy >= cords[1] && yy <= cords[1] + 150){
                    return (tobool) ? true : obj;
                }
            }
        }
        return false;
    }

    TicTacToe.prototype.tickIt = function(obj){
        var cords = obj.cords;
        var x     = cords[0];
        var y     = cords[1];

        obj.used  = true;

        switch (this.turn) {
            case 'X':
                this.turn  = 'O';
                obj.player = 'X';
                this.board.drawX(x, y);
                break;
            case 'O':
                this.turn  = 'X';
                obj.player = 'O';
                this.board.drawO(x, y);
                break;
            default:
                alert('Error');
                return false;
        }

        this.scores[this.turn] += obj['scoresIndicator'];

        this.checkIfWon();
    }

    TicTacToe.prototype.winningModels = function(current){
        var winnings  = [
                            '111000000', '000111000',
                            '000000111', '100100100',
                            '010010010', '001001001',
                            '100010001', '001010100'
                        ];

        var r = new Array(winnings.length);

        for (var i = winnings.length; i--;) {
            r[i] = parseInt(winnings[i], 2);
        }

        return r;
    }

    TicTacToe.prototype.checkIfWon = function(){
        var winningModelsArray = this.winningModels();

        var winner = false;

        for(var i = 0, length = winningModelsArray.length; i < length; i++){
            if((winningModelsArray[i] & this.scores['X']) == winningModelsArray[i]){
                winner = 'O';
            }else if((winningModelsArray[i] & this.scores['O']) == winningModelsArray[i]){
                winner = 'X'
            }
        }

        winner && (confirm(winner + ' WON! DO YOU WANT TO PLAY AGAIN?') && new TicTacToe());
    }

    var Board = function(tic){
        var _self          = this;
        this.tic           = tic;

        this.canvas        = document.createElement('canvas');
        this.canvas.id     = 'myCanvas';
        this.canvas.width  = 510;
        this.canvas.height = 510;

        this.context       = this.canvas.getContext('2d');

        this.mousePointer  = false;
        this.drawing       = false;

        document.body.appendChild(this.canvas);

        this.canvas.addEventListener('click', function(e){
            _self.playerAction(e);
        });

        this.canvas.addEventListener('mousemove', function(e){
            _self.playerMouseHover(e);
        });
    };

    Board.prototype.drawTile = function(x, y){
        this.context.fillStyle = '#360000';
        this.context.fillRect(x, y, 150, 150);
    }

    Board.prototype.drawO = function(x, y){
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth   = 4;
        this.context.beginPath();

        this.context.arc(x + 75, y + 75, 50, 0, 2 * Math.PI);
        this.context.stroke();

        this.drawing = false;
    }

    Board.prototype.drawX = function(x, y){
        var x1Cord = x + 35;
        var y1Cord = y + 35;
        var x2Cord = x + 115;
        var y2Cord = y + 115;

        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth   = 4;
        this.context.lineCap     = 'round';

        this.context.beginPath();

        this.context.moveTo(x1Cord, y1Cord);
        this.context.lineTo(x2Cord, y2Cord);
        this.context.moveTo(x2Cord, y1Cord);
        this.context.lineTo(x1Cord, y2Cord);

        this.context.stroke();

        this.drawing = false;
    }

    Board.prototype.playerMouseHover = function(e){
        var xCord = e.clientX - this.canvas.offsetLeft;
        var yCord = e.clientY - this.canvas.offsetTop;

        if(this.tic.isValidTale(xCord, yCord, true)){
            this.mousePointer = true;
        }

        this.makePointer();
    }

    Board.prototype.makePointer = function(){
        this.canvas.style.cursor = (this.mousePointer) ? 'pointer' : 'default';
        this.mousePointer = false;
    }

    Board.prototype.playerAction = function(e){
        if(this.drawing) return;

        var xCord = e.clientX - this.canvas.offsetLeft;
        var yCord = e.clientY - this.canvas.offsetTop;

        var valid = this.tic.isValidTale(xCord, yCord);

        if(valid !== false){
            if(!valid.used){
                this.drawing = true;
                this.tic.tickIt(valid);
            }
        }
    }

    var game = new TicTacToe();
})(window, document);
