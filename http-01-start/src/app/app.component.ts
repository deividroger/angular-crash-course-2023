import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Post} from './post.model'
import { PostService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export default class AppComponent implements OnInit, OnDestroy {
  
  loadedPosts: Post[] = [];
  isFeatching = false;
  error = null;

  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}
  
  ngOnDestroy(): void {
    this.errorSub.unsubscribe(); 
  }

  ngOnInit() {

    this.errorSub = this.postService.error.subscribe(errorMessage =>{
      this.error = errorMessage;
    });

    this.isFeatching = true;
    this.postService
        .fetchPosts()
        .subscribe(posts =>{
          this.isFeatching = false;
          this.loadedPosts = posts;
        },(error=>{ 
          this.error = error.message;
          this.isFeatching = false;
        }));
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title,postData.content);
    
    
  }

  onFetchPosts() {
    
    this.isFeatching = true;
    this.postService
        .fetchPosts()
        .subscribe(posts =>{
          this.isFeatching = false;
          this.loadedPosts = posts;
        },(error=>{ 
          this.error = error.message;
          this.isFeatching = false;
        }));
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(()=>{
      this.loadedPosts  = [];
    });
  }

  onHandleError(){
    this.error = null;
  }

}
