import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  username : string | null = ''

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }



}
