let DOMstuff=require('./DOMstuff');


const createDOMboardAI_mode=(boardname)=>{
    let DOMboard=DOMstuff.createDOMboard(boardname);
    DOMboard.switchShooter=(boardname)=>{
        let opponent=document.querySelector(`.board-wrappers>:not(.${boardname})>.board`);
        opponent.classList.toggle('ready');
        document.querySelector(`.board-wrapper.${boardname}>.board`).classList.toggle('ready');
        if(boardname==='AI') AI_turn();
    }

    DOMboard.announceWinner=(boardname)=>{
        let continue_btn=document.createElement('button');
        continue_btn.textContent='Continue';
        document.querySelector('.board-wrappers').insertAdjacentElement('afterend',continue_btn);
        document.querySelector(`.board.${boardname}`).classList.add('ready');
        continue_btn.addEventListener('click',()=>{
            document.querySelector('.board-wrappers').innerHTML=``;
            document.querySelector('#change-mode-btn').style['opacity']='';
            continue_btn.remove();
            startAI_game();
        })
        document.querySelector('#current-info').textContent=`${(boardname==='p1')?'AI':'p1'} wins`;
    }

    let createDOMboard=Object.create(DOMboard);


    return createDOMboard
}

export const startAI_game=()=>{
    let curr_info=document.querySelector('#current-info');
    curr_info.textContent='';
    document.querySelector('.board-wrappers').innerHTML=``;
    let start_btn=document.createElement('button');
    start_btn.textContent='Start';
    let p1=createDOMboardAI_mode('p1');
    let p2=createDOMboardAI_mode('AI');
    p1.addDOMboard();
    p1.updateBoard();
    p1.getDOMboard().classList.toggle('ready');
    p1.addBoardbtn();
    let readybutton1=document.querySelector(`.board-wrapper.p1 .ready-btn`);
    readybutton1.addEventListener('click',()=>{
        p1.readyDOMboard();
        curr_info.textContent='Press start when you are ready';
        document.querySelector('.board-wrappers').insertAdjacentElement('afterend',start_btn);
    });
    curr_info.textContent='Your turn to set up the board';


    start_btn.addEventListener('click',()=>{
        document.querySelector('#change-mode-btn').style['opacity']='0';
        p1.startgame();
        p1.getDOMboard().style['pointer-events']='none'
        p2.addDOMboard();
        p2.startgame();
        p2.getDOMboard().classList.toggle('ready');
        start_btn.remove();  
    })
}

const createshootableboard=()=>{
    let board=[];
    document.querySelectorAll('.p1 .row').forEach((row,i)=>{
        let availablespot=[i,[]];
        row.querySelectorAll('div').forEach((square,k)=>{
            if(square.classList.length<3){
                availablespot[1]=[...availablespot[1],k];
            }
        })
        if(availablespot[1].length>0)board=[...board,availablespot];
    })
    return board
}


//the AI has 3 mode
// mode 1: it tries to randomly shoot a spot on your board
// if it hits than it move on to mode 2
// mode 2: now that it hit a spot it is going to try to
// check if the ship is vertical or not
// mode 3: it try to shoot right or down based on the result of the 
// previous mode to finish the ship. If it hits a roadblock(the end of the row
// or the next suqare has already been shot) it returns to the first square in mode 1
// and start to shoot left or up untill the ship is sunk
let mode=1;
let directions=[[[1,0],[-1,0]],[[0,1],[0,-1]]];
let currdirection
let hitpos;
let ships=9;

const randomInt=(min,max)=>Math.floor(Math.random()*(max-min)+min);

const shootBoard=(gridlocation)=>{
    gridlocation.dispatchEvent(new Event('click'));
}

const shootBoardAsync=(gridlocation,min,max)=>{
    return new Promise((resolve)=>{
        setTimeout(function(){
            resolve(shootBoard(gridlocation))
        },randomInt(min,max))
    })
}


const AI_turn=()=>{
    if(ships===0) return
    if(mode===1){
        AI_mode1();
        return
    }
    if(mode===2){
        AI_mode2();
        return
    }
}

const AI_mode1=async()=>{
    let p1=document.querySelector('.p1');
    let board =createshootableboard();
    let randomrowindex=randomInt(0,board.length);
    let randomrow=board[randomrowindex][0];
    let randomcolkindex=randomInt(0,board[randomrowindex][1].length);
    let randomcol=board[randomrowindex][1][randomcolkindex];
    let pos=[randomcol,randomrow];
    let targetedsquare=p1.querySelector(`.row${pos[1]}.col${pos[0]}`);
    await shootBoardAsync(targetedsquare,1000,2000);


    if(targetedsquare.classList[2]==='hit'){
        mode=2;
        hitpos=pos;
        AI_mode2();
    }
    return
}

const AI_mode2=async ()=>{
    let p1=document.querySelector('.p1');
    if(directions.length<1){
        mode=1;
        directions=[[[1,0],[-1,0]],[[0,1],[0,-1]]];
        ships--;
        AI_mode1();
        return
    }
    let randomaxisindex=randomInt(0,directions.length);
    let randomaxis=directions[randomaxisindex];
    let randomdirectionindex=randomInt(0,randomaxis.length);
    let randomdirection=randomaxis[randomdirectionindex];
    directions[randomaxisindex].splice(randomdirectionindex,1);
    if(directions[randomaxisindex].length<1) directions.splice(randomaxisindex,1);
    let pos=[hitpos[0]+randomdirection[0],hitpos[1]+randomdirection[1]];
    if(pos[0]>-1&&pos[0]<10&&pos[1]>-1&&pos[1]<10){
        let square=p1.querySelector(`.row${pos[1]}.col${pos[0]}`);
        if(square.classList.length<3){
            await shootBoardAsync(square,1000,1500);
            if(square.classList[2]==='hit'){
                directions=directions.slice(randomaxisindex,randomaxisindex+1);
                currdirection=randomdirection;
                AI_mode3();
            }
            return;
        }
    }
    AI_mode2();
    return
}

const AI_mode3=async ()=>{
    let p1=document.querySelector('.p1');
    let pos=[hitpos[0]+currdirection[0]+currdirection[0],
hitpos[1]+currdirection[1]+currdirection[1]];
    while(pos[0]>-1&&pos[0]<10&&pos[1]>-1&&pos[1]<10){
        let square=p1.querySelector(`.row${pos[1]}.col${pos[0]}`);
        if(square.classList.length<3){
            await shootBoardAsync(square,1000,1000);
            if(square.classList[2]!=='hit'){
                return
            }
            else {
                pos=[pos[0]+currdirection[0],
                pos[1]+currdirection[1]];
                continue;
            }
        }
        AI_mode2();
        return;
    }
    AI_mode2();
    return;
}


