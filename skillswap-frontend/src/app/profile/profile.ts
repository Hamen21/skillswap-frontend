import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-profile',

  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],

  templateUrl: './profile.html',

  styleUrl: './profile.css'
})
export class Profile {

  editing = false;

  name = '';

  bio = '';


  education = {

    college: '',

    degree: '',

    year: '',

    specialization: ''

  };


  teachSkills: string[] = [];

  learnSkills: string[] = [];


  newTeachSkill = '';

  newLearnSkill = '';


  userId = '';


  constructor(

    private apiService: ApiService,

    private router: Router,

    private changeDetector: ChangeDetectorRef

  ) {

    this.loadProfile();

  }


  // LOAD PROFILE FROM MONGODB
  loadProfile() {

    const currentUser =

      JSON.parse(

        localStorage.getItem(
          'currentUser'
        ) || '{}'

      );


    if (!currentUser.id) {

      alert(
        'Please login again.'
      );

      this.router.navigate(
        ['/login']
      );

      return;

    }


    this.userId =
      currentUser.id;


    this.apiService
      .getUser(this.userId)
      .subscribe({

        next: (user: any) => {

          


          // NAME
          this.name =
            user.name || '';


          // BIO
          this.bio =
            user.bio || '';


          // EDUCATION
          this.education = {

            college:
              user.education?.college || '',

            degree:
              user.education?.degree || '',

            year:
              user.education?.year || '',

            specialization:
              user.education?.specialization || ''

          };


          // TEACH SKILLS
          this.teachSkills =
            user.teachSkills || [];


          // LEARN SKILLS
          this.learnSkills =
            user.learnSkills || [];


          // Force Angular to update the page
          this.changeDetector.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load profile:',
            error
          );

          alert(
            'Failed to load profile.'
          );

        }

      });

  }


  // EDIT / SAVE PROFILE
  toggleEdit() {

    // Enter edit mode
    if (!this.editing) {

      this.editing = true;

      return;

    }


    const profileData = {

      name: this.name,

      bio: this.bio,

      education: {

        college:
          this.education.college,

        degree:
          this.education.degree,

        year:
          this.education.year,

        specialization:
          this.education.specialization

      },

      teachSkills:
        this.teachSkills,

      learnSkills:
        this.learnSkills

    };


    this.apiService
      .updateProfile(
        this.userId,
        profileData
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Profile updated successfully:',
            response
          );


          this.editing = false;


          alert(
            'Profile saved successfully!'
          );


          // Reload profile from MongoDB
          this.loadProfile();

        },


        error: (error) => {

          console.error(
            'Profile update failed:',
            error
          );

          alert(

            error.error?.message ||

            'Failed to save profile'

          );

        }

      });

  }


  // ADD TEACHING SKILL
  addTeachSkill() {

    const skill =
      this.newTeachSkill.trim();


    if (

      skill &&

      !this.teachSkills.includes(
        skill
      )

    ) {

      this.teachSkills.push(
        skill
      );

      this.newTeachSkill = '';

    }

  }


  // ADD LEARNING SKILL
  addLearnSkill() {

    const skill =
      this.newLearnSkill.trim();


    if (

      skill &&

      !this.learnSkills.includes(
        skill
      )

    ) {

      this.learnSkills.push(
        skill
      );

      this.newLearnSkill = '';

    }

  }


  // DELETE TEACHING SKILL
  deleteTeachSkill(
    skill: string
  ) {

    this.teachSkills =

      this.teachSkills.filter(

        s => s !== skill

      );

  }


  // DELETE LEARNING SKILL
  deleteLearnSkill(
    skill: string
  ) {

    this.learnSkills =

      this.learnSkills.filter(

        s => s !== skill

      );

  }

}