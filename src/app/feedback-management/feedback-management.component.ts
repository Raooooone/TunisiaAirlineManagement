import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { Feedback } from '../interface/feedback';

@Component({
  selector: 'app-feedback-management',
  templateUrl: './feedback-management.component.html',
  styleUrls: ['./feedback-management.component.css'],
})
export class FeedbackManagementComponent implements OnInit {
  feedbackList: Feedback[] = [];
  filteredFeedbackList: Feedback[] = [];
  searchTerm: string = '';

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    // Fetch all feedback on component initialization
    this.feedbackService.getFeedback().subscribe((feedback) => {
      this.feedbackList = feedback;
      this.filteredFeedbackList = [...this.feedbackList];
    });
  }

  // Delete feedback
  deleteFeedback(id: number): void {
    this.feedbackService.deleteFeedback(id).subscribe(
      () => {
        // Update the list after deleting the feedback
        this.filteredFeedbackList = this.filteredFeedbackList.filter(fb => fb.id !== id);
        this.feedbackList = this.feedbackList.filter(fb => fb.id !== id);
      },
      (error) => {
        console.error('Error deleting feedback:', error);
      }
    );
  }

  // Filter feedback based on the search term
  searchFeedback(): void {
    if (this.searchTerm) {
      this.filteredFeedbackList = this.feedbackList.filter((feedback) =>
        feedback.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        feedback.firstImpression.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        feedback.suggestion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredFeedbackList = [...this.feedbackList];
    }
  }
}
