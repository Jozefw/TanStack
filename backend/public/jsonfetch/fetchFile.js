import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId:"AKIAXOFCN37RDEPZIJME", 
    secretAccessKey:"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",
    region:"US West (N. California) us-west-1"
});

const S3 = new AWS.S3();

export default function getEventsFromS3 () {
        return new Promise((resolve,reject) => {
            try {
                const bucketName = 'eightyimages';
                const objectKey = 'images.json';
                S3.getObject({
                    Bucket:bucketName,
                    Key:objectKey
                },(err,data) => {
                    if(err) {
                        reject(err);
                    }else{
                        console.log('Unparsed Data',data);
                        resolve(data)
                    }
                });
            }catch(error){
                reject(error);
            }
        });
    }