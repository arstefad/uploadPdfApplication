import { Component } from '@angular/core';
import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { DetectDocumentTextCommand, TextractClient} from "@aws-sdk/client-textract";

//console.log(textract);
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
          this.isFileImage = true;
          this.isFileDocument = false;
        }else{
          this.isFileImage = false;
          this.isFileDocument = true;
        }
      }

     
      



    }
  }


  /** fetch the s3 object from the event and analyze it using Amazon Textract */

   extractData  = async(eventBridgeEvent: any) => {
    const textractClient = new TextractClient();
    
    const detectDocumentTextCommand = new DetectDocumentTextCommand({

      Document: {
        S3Object: {
          Bucket: eventBridgeEvent.Bucket,
          Name: eventBridgeEvent.object
        },
      
      },
    });
  
    const { Blocks } = await textractClient.send(detectDocumentTextCommand);
    const extractedWords = Blocks?.filter((b) => b.BlockType === "WORD").map(
      (b) => b.Text,
    );
    return extractedWords?.join(" ");
  };
  }



