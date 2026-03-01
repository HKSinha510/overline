import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Booking ID to review' })
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @ApiProperty({ description: 'Rating 1-5 stars', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review comment' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @ApiPropertyOptional({ description: 'Staff rating 1-5 stars', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  staffRating?: number;
}

export class ReplyReviewDto {
  @ApiProperty({ description: 'Reply to the review' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reply: string;
}

// User feedback from owner/staff after service
export class CreateUserFeedbackDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @ApiProperty({ description: 'User ID being rated' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Rating 1-5 stars', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Behavior: excellent, good, fair, poor' })
  @IsOptional()
  @IsString()
  behavior?: string;

  @ApiPropertyOptional({ description: 'Private note about customer' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({ description: 'Was the customer on time?' })
  @IsOptional()
  @IsBoolean()
  wasOnTime?: boolean;

  @ApiPropertyOptional({ description: 'Was the customer polite?' })
  @IsOptional()
  @IsBoolean()
  wasPolite?: boolean;

  @ApiPropertyOptional({ description: 'Would serve this customer again?' })
  @IsOptional()
  @IsBoolean()
  wouldServeAgain?: boolean;
}
