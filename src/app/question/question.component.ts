import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
public name:string="";
public questionList:any =[];
public currentQuestions:number=0;
public points:number=0;
correctAnswer:number=0;
inCorrectAnswer:number=0;
interval$:any;
progress:string="0";
isQuizCompleted:boolean=false

counter=60;
  constructor(private questionService:QuestionService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }
getAllQuestions(){
  this.questionService.getQuestionJson().subscribe(res=>{ console.log(res.questions);
    this.questionList=res.questions;
  })
}
nextQuestions(){
this.currentQuestions++;
}
prevQuestions(){
this.currentQuestions--;
}
answers(currentQno:number,option:any){
  if(currentQno===this.questionList.length){
    this.isQuizCompleted=true;
    this.stopCounter();
  }
if(option.correct){
  this.points+=10;
  this.correctAnswer++;
  setTimeout(() => {
    this.currentQuestions++;
    this.resetCounter();
    this.getProgressPercent();
    
  }, 1000);
  
}else{
  // this.points-=10;
  setTimeout(() => {
    this.currentQuestions++;
    this.inCorrectAnswer++;
    this.resetCounter();
    this.getProgressPercent();
  }, 1000);
  
}
}
startCounter(){
  this.interval$=interval(1000).subscribe(val=>{
    this.counter--;
    if(this.counter==0){
      this.currentQuestions++;
      this.counter=60;
    }
  });
  setTimeout(() => {
    this.interval$.unsubscribe();
    
  }, 6000000);
}
stopCounter(){
  this.interval$.unsubscribe();
  this.counter=0;
}
resetCounter(){
  this.stopCounter();
  this.counter=60;
  this.startCounter();
}
resetQuiz(){
  this.resetCounter();
  this.getAllQuestions();
  this.points=0;
  this.currentQuestions=0;
}
getProgressPercent(){
  this.progress=((this.currentQuestions/this.questionList.length)*100).toString();
  return this.progress;
}
}
