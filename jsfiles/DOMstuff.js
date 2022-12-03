
const {Board,Ship}= require('./battlship');

//prevent ship from dropping outside the board
window.addEventListener('dragover', e => {
    if (e.target.classList[0]!=='board') {
      e.preventDefault()
    }
  })
  




export const createDOMboard=function (boardname){
    let newDOMboard=document.createElement('div');
    newDOMboard.className=`board-wrapper flex ${boardname}`;
    newDOMboard.innerHTML=`
    <div class="board ${boardname}">

    </div>`



    let readystatus=false;
    const board=Board(9,{
        Battleship1:new Ship("Battleship1",4,true),
        Battleship2:new Ship("Battleship2",4,true),

        Cruiser1:new Ship("Cruiser1",3,true),
        Cruiser2:new Ship("Cruiser2",3,true),
        Cruiser3:new Ship("Cruiser3",3,true),
        Destroyer1:new Ship("Destroyer1",2,true),
        Destroyer2:new Ship("Destroyer2",2,true),
        Destroyer3:new Ship("Destroyer3",2,true),
        Destroyer4:new Ship("Destroyer4",2,true),
    });
    board.randomPlace();
    let getboard=board.getBoard();


    let boardMethods={}


    boardMethods.getReadyStatus=()=>readystatus;


    boardMethods.placeDOMship=function (name,maxlen,isVertical,pos){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        if(isVertical==='true'){
            for(let i=0,k=0;i<maxlen;i++,k++){
                DOMboard.querySelector(`.row${pos[0]+k}.col${pos[1]}`)
                .className=`row${pos[0]+k} col${pos[1]} ship ${name} ${i} ${maxlen} ${isVertical}`;
                DOMboard.querySelector(`.row${pos[0]+k}.col${pos[1]}`)
                .draggable=true;
            }
        }
        else{
            for(let i=0,k=0;i<maxlen;i++,k++){
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+k}`)
                .className=`row${pos[0]} col${pos[1]+k} ship ${name} ${i} ${maxlen} ${isVertical}`;
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+k}`)
                .draggable=true;
            } 
        }
    }


    boardMethods.deleteDOMship=function (pos){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        const shipInfo=DOMboard.querySelector(`.row${pos[0]}.col${pos[1]}`).classList;
        const index=+shipInfo[4];
        const maxlen=+shipInfo[5];
        const isVertical=shipInfo[6];
        if(isVertical==='true'){
            for(let i=index,k=0;i<maxlen;i++,k++){
                DOMboard.querySelector(`.row${pos[0]+k}.col${pos[1]}`)
                .className=`row${pos[0]+k} col${pos[1]}`;
                DOMboard.querySelector(`.row${pos[0]+k}.col${pos[1]}`)
                .draggable=false;
            } 
            for(let i=index-1,k=1;i>-1;i--,k++){
                DOMboard.querySelector(`.row${pos[0]-k}.col${pos[1]}`)
                .className=`row${pos[0]-k} col${pos[1]}`;
                DOMboard.querySelector(`.row${pos[0]-k}.col${pos[1]}`)
                .draggable=false;
            }
        }
        else{
            for(let i=index,k=0;i<maxlen;i++,k++){
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+k}`)
                .className=`row${pos[0]} col${pos[1]+k}`;
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+k}`)
                .draggable=false;
            } 
            for(let i=index-1,k=1;i>-1;i--,k++){
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]-k}`)
                .className=`row${pos[0]} col${pos[1]-k}`;
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]-k}`)
                .draggable=false;
            }
        }
    }


    boardMethods.dragoverhandler=function(ev){
        ev.preventDefault();
    }


    boardMethods.handleDrop=function (ev){
        ev.preventDefault();
        window.removeEventListener('drop',this.preventDropping);
        let shipInfo=ev.dataTransfer.getData("Text").split(',');
        if(shipInfo[7]!==boardname) return
        const name=shipInfo[3];
        const length=+shipInfo[5];
        const index=+shipInfo[4];
        const vertical=shipInfo[6];
        const lastposX=(vertical==='true')?+shipInfo[1][3]:(+shipInfo[1][3])-index;
        const lastposY=(vertical==='true')?(+shipInfo[0][3])-index:+shipInfo[0][3];
        let lastpos=[lastposY,lastposX];
        let classname=ev.target.classList[0]||''
        //prevent ship from dropping to another board
        if(!classname.includes('row')){
            board.placeShip(name,lastpos);
            this.placeDOMship(name,length,vertical,lastpos);
            document.querySelector('.dragedShip').remove();
            return
        }


        if(ev.target.parentElement.parentElement.classList[0]!=='board'){
            board.placeShip(name,lastpos);
            this.placeDOMship(name,length,vertical,lastpos);
            document.querySelector('.dragedShip').remove();
            return
        }


        const posX=(vertical==='true')?+ev.target.classList[1][3]:(+ev.target.classList[1][3])-index;
        const posY=(vertical==='true')?(+ev.target.classList[0][3])-index:+ev.target.classList[0][3];
        let pos=[posY,posX];


        if(board.placeShip(name,pos)&&ev.target.parentElement.parentElement.className.includes(boardname)){
            this.placeDOMship(name,length,vertical,pos);
        }
        else{
            board.placeShip(name,lastpos);
            this.placeDOMship(name,length,vertical,lastpos);
        }
        document.querySelector('.dragedShip').remove();
    }


    boardMethods.preventDropping=(function (e){
        let classname=e.target.classList[0]||'';
        if(e.dataTransfer.getData("Text").split(',')[7]!==boardname) return
        if (!classname.includes('row')) {
          e.preventDefault();
          this.handleDrop(e);
        }
    }).bind(boardMethods)




    //function for dragstart and create a ghost image of the ship
    boardMethods.handleDrag=function(ev){
        window.addEventListener('drop',this.preventDropping);
        let dragedshipinfo=[...ev.target.classList,boardname];
        let dragedship=document.createElement('div');
        let mouseposX=17.5*((dragedshipinfo[6]==='true')?1:Number(dragedshipinfo[4])*2+1);
        let mouseposY=17.5*((dragedshipinfo[6]==='true')?Number(dragedshipinfo[4])*2+1:1);
        dragedship.className=`dragedShip ${(dragedshipinfo[6]==='true')?'vertical':'horizontal'}`;

        for(let i=0;i<dragedshipinfo[5];i++){
            let dragedshippart=document.createElement('div');
            dragedshippart.className='dragedShippart';
            dragedship.appendChild(dragedshippart);
        }


        document.body.appendChild(dragedship);
        ev.dataTransfer.setDragImage(dragedship,mouseposX,mouseposY);
        ev.dataTransfer.setData("text",dragedshipinfo);
        board.deleteShip([+dragedshipinfo[0][3],+dragedshipinfo[1][3]]);
        this.deleteDOMship([+dragedshipinfo[0][3],+dragedshipinfo[1][3]]);
    }


    boardMethods.changeDOMdirection=function (ev){
        let ship=ev.target.classList;
        if(ship.length<3) return
        const name=ship[3];
        const length=+ship[5];
        const index=+ship[4];
        const row=+ship[0][3];
        const col=+ship[1][3];
        const pos=(ship[6]==='true')?
        [row-index,col]:[row,col-index];
        const vertical=(ship[6]==='true')?'false':'true';
        if(board.changeDirection(pos)){
            this.deleteDOMship(pos);
            this.placeDOMship(name,length,vertical,pos);
        }
    }


    boardMethods.explodeDOMshippart=function(pos){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        if(pos[0]-1>-1&&pos[0]-1<10){
            if(!DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]}`).className.match(/hit|missed/g)){
            DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]}`).classList.add('missed');
            DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]}`).removeEventListener('click',this.firedDOMsquare);
        }
        if(pos[1]+1<10){
            if(!DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]+1}`).className.match(/hit|missed/g)){
                DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]+1}`).classList.add('missed');
                DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]+1}`).removeEventListener('click',this.firedDOMsquare);
            }
        }
        if(pos[1]-1>-1){
            if(!DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]-1}`).className.match(/hit|missed/g)){
                DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]-1}`).classList.add('missed');
                DOMboard.querySelector(`.row${pos[0]-1}.col${pos[1]-1}`).removeEventListener('click',this.firedDOMsquare);
            }
        }
        }
        if(pos[0]+1>-1&&pos[0]+1<10){
            if(!DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]}`).className.match(/hit|missed/g)){
            DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]}`).classList.add('missed');
            DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]}`).removeEventListener('click',this.firedDOMsquare);
        }
        if(pos[1]+1<10){
            if(!DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]+1}`).className.match(/hit|missed/g)){
                DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]+1}`).classList.add('missed');
                DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]+1}`).removeEventListener('click',this.firedDOMsquare);
            }
        }
        if(pos[1]-1>-1){
            if(!DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]-1}`).className.match(/hit|missed/g)){
                DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]-1}`).classList.add('missed');
                DOMboard.querySelector(`.row${pos[0]+1}.col${pos[1]-1}`).removeEventListener('click',this.firedDOMsquare);
            }
        }
        }
        if(pos[1]+1<10){
            if(!DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+1}`).className.match(/hit|missed/g)){
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+1}`).classList.add('missed');
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]+1}`).removeEventListener('click',this.firedDOMsquare);
            }
        }
        if(pos[1]-1>-1){
            if(!DOMboard.querySelector(`.row${pos[0]}.col${pos[1]-1}`).className.match(/hit|missed/g)){
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]-1}`).classList.add('missed');
                DOMboard.querySelector(`.row${pos[0]}.col${pos[1]-1}`).removeEventListener('click',this.firedDOMsquare);
            }
        }
    }

    
    boardMethods.explodeDOMship=function(pos){
        let shippart=getboard[pos[0]][pos[1]];
        let index=shippart.index;
        let maxlen=shippart.maxlen;
        let vertical=shippart.vertical;

        if(vertical){
            for(let i=index,k=0;i<maxlen;i++,k++){
                this.explodeDOMshippart([pos[0]+k,pos[1]]);
            } 
            for(let i=index-1,k=1;i>-1;i--,k++){
                this.explodeDOMshippart([pos[0]-k,pos[1]]);
            }
        }
        else{
            for(let i=index,k=0;i<maxlen;i++,k++){
                this.explodeDOMshippart([pos[0],pos[1]+k]);
            } 
            for(let i=index-1,k=1;i>-1;i--,k++){
                this.explodeDOMshippart([pos[0],pos[1]-k]);
            }
        }
    }


    boardMethods.clearDOMboard=function(){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        for(let i=0;i<getboard.length;i++){
            for(let k=0;k<getboard[i].length;k++){
                //reset the square
                DOMboard.querySelector(`.row${i}.col${k}`)
                .className=`row${i} col${k}`;
                DOMboard.querySelector(`.row${i}.col${k}`)
                .removeAttribute('draggable');
                //replace the square to remove all eventListeners
                DOMboard.querySelector(`.row${i}.col${k}`)
                .replaceWith(DOMboard.querySelector(`.row${i}.col${k}`).cloneNode());
            }
        }
    }


    boardMethods.updateBoard=function(){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        getboard=board.getBoard();
        for(let i=0;i<getboard.length;i++){
            for(let k=0;k<getboard[i].length;k++){
                if(getboard[i][k]){
                    DOMboard.querySelector(`.row${i}.col${k}`).className=DOMboard.querySelector(`.row${i}.col${k}`).className+` ship ${getboard[i][k].name} ${getboard[i][k].index} ${getboard[i][k].maxlen} ${getboard[i][k].vertical}`;
                    DOMboard.querySelector(`.row${i}.col${k}`).draggable=true;
                }
                readystatus=true;
                DOMboard.querySelector(`.row${i}.col${k}`).addEventListener('dragstart',this.handleDrag.bind(this));
                DOMboard.querySelector(`.row${i}.col${k}`).addEventListener('click',this.changeDOMdirection.bind(this));
                DOMboard.querySelector(`.row${i}.col${k}`).addEventListener('dragover',this.dragoverhandler.bind(this));
                DOMboard.querySelector(`.row${i}.col${k}`).addEventListener('drop',this.handleDrop.bind(this));
            }
        }
    }


    boardMethods.readyDOMboard=function(){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        readystatus=true;
        DOMboard.classList.toggle('ready');
        DOMboard.parentElement.querySelector('.button-wrapper').remove();
        this.clearDOMboard();
    }


    boardMethods.startgame=function(){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        for(let i=0;i<getboard.length;i++){
            for(let k=0;k<getboard[i].length;k++){
                //reset the square
                DOMboard.querySelector(`.row${i}.col${k}`)
                .className=`row${i} col${k}`;
                //replace the square to remove all eventListeners
                DOMboard.querySelector(`.row${i}.col${k}`)
                .replaceWith(DOMboard.querySelector(`.row${i}.col${k}`).cloneNode());
                //add the fired function
                DOMboard.querySelector(`.row${i}.col${k}`)
                .addEventListener('click',this.firedDOMsquare)
            }
        }
    }


    boardMethods.firedDOMsquare=(function(ev){
        let DOMboard=document.querySelector(`.board.${boardname}`);
        let posX=+ev.target.classList[1][3];
        let posY=+ev.target.classList[0][3];
        let fired=board.fired([posY,posX]);
        if(fired[0]){
            DOMboard.querySelector(`.row${posY}.col${posX}`).classList.add('hit');
            (fired[1])?this.explodeDOMship([posY,posX]):0;
            if(fired[2]){
                this.announceWinner(boardname);
            }
            DOMboard.querySelector(`.row${posY}.col${posX}`).removeEventListener('click',this.firedDOMsquare);
            return [true,false]
        }
        else{
            DOMboard.querySelector(`.row${posY}.col${posX}`).classList.add('missed');
            DOMboard.querySelector(`.row${posY}.col${posX}`).removeEventListener('click',this.firedDOMsquare);
            this.switchShooter(boardname);
            return [false]
        }
    }).bind(boardMethods)

    boardMethods.randomBoard=function(){
        this.clearDOMboard();
        board.clearboard();
        board.randomPlace();
        this.updateBoard();
    }

    boardMethods.addBoardbtn=function() {
        let DOMboard=document.querySelector(`.board.${boardname}`);
        let button_wrapper=document.createElement('div');
        button_wrapper.className='button-wrapper';
        button_wrapper.innerHTML=`
        <button class="ready-btn">Ready</button>
        <button class="random-btn">Random!</button>
        `
        DOMboard.parentElement.appendChild(button_wrapper);

        DOMboard.parentElement.querySelector('.random-btn').addEventListener('click',this.randomBoard.bind(this))
    }



    boardMethods.addDOMboard=function(){
        document.querySelector('.board-wrappers').appendChild(newDOMboard);
        let DOMboard=document.querySelector(`.board.${boardname}`);
        for(let i=0;i<getboard.length;i++){
            let newRow=document.createElement('div');
            newRow.className="row";
            for(let k=0;k<getboard[i].length;k++){
                let square=document.createElement('div');
                square.className=`row${i} col${k}`;
                newRow.appendChild(square);
            }
            DOMboard.appendChild(newRow);
        }
        DOMboard.classList.toggle('ready');
    }

    boardMethods.getDOMboard=()=>document.querySelector(`.board.${boardname}`)
    boardMethods.printBoard=()=>board.getBoard()



    return boardMethods
    
}

