import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  tags: string[];
}

export type ResearchDocumentDocument = HydratedDocument<ResearchDocument>;
export const ResearchDocumentSchema =
  SchemaFactory.createForClass(ResearchDocument);

ResearchDocumentSchema.index({ projectId: 1 });
ResearchDocumentSchema.index({ content: 'text' });
