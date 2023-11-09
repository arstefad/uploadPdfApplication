import { Component } from '@angular/core';
import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pdf Application';
  selectedFile:any = "";
  selectedFilePath: string = "";
  selectedFileB64: string = "";
  isFileImage = false;
  isFileDocument = false;

  constructor(private pdfServices: NgxExtendedPdfViewerService){}

  onFileSelected(event: any): void{
    this.selectedFile = event.target.files[0] ?? null;
    if(this.selectedFile){
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) =>{
        let path = event.target == null ? '' : event.target.result;
        this.selectedFilePath = path as string;
        this.selectedFileB64 = this.selectedFilePath.split(",")[1];
        if(this.selectedFilePath.includes("image")){
          this.isFileDocument = false;
        }else{
          this.isFileDocument = true;
        }
      }



    }
  }







}
