import axios from 'axios';
import { LitElement, css, html } from 'lit'
import { customElement, property,state } from 'lit/decorators.js'

interface User {
  name: string
  login: string
  avatar_url: string
  html_url: string
  followers:number
  following:number
  location:string
}


@customElement('github-preview')
export class GithubPreview extends LitElement {
 

  
@property ({type:String}) username=''
@state() user: User | null = null
@state() loading:Boolean =false
@state() error:Boolean=false
async _getGithubData(){

  const res= await axios.get(`https://api.github.com/users/${this.username}`).then(res=>res)
  .catch(error=>error)
  if(res.status==200){
  this.user=res.data
  this.loading=false
  }

  else if(res.status!=200) {
    this.loading=false
    this.error=true
  }
  }

  firstUpdated() {
      this.loading=true
   this._getGithubData();
  
  }

  render() {
    return html`
  
<div class="github-card">
${this.error ? html `<div class='error-container'>
<p>Something went wrong </p>
<p> Check the username or try again later</p>
</div>` :null}

${this.loading ?
  html `
  <div>
    <p>Loading...</p>
  </div>`
  :null}
${this.user?.login ?
  html `
  <img id='userimg' src=${this.user?.avatar_url} alt='user-photo'>
  <h3>${this.user?.name}</h3>
  <div class='desc'>
    <p>Followers: ${this.user?.followers}</p>
    <p>Following: ${this.user?.following}</p>
    <p>${this.user?.location ? this.user?.location:'Not found' }</p>
  </div>
  <button> <a href=${this.user?.html_url}>Visit Profile</a></button>`
:null}

</div>



    `
  }


  static styles = css`
  #userimg{
    border-radius:100%;
    width:50px;
    
  }
    .github-card{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction:column;
      gap:1rem;
      width:20rem;
      height:24rem;
      background-color:#222;
      color:#f1f1f1;
      border-radius:10px;
      
    }

   
    button{
      height:25px;
      width:150px;
      background:none;
      border:solid 1px #f1f1f1;
      border-radius:3px;
    }
a{
  text-decoration:none;
  color:#f1f1f1;
  padding:10px;
}
@media (max-width: 600px){
  .github-card{
    width:14rem;
    height:30rem;
  }
}
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'github-preview': GithubPreview
  }
}


