
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async syncUser(userData: { auth0Id: string; email: string; name: string }) {
        const { auth0Id, email, name } = userData;
        return this.userModel.findOneAndUpdate(
            { auth0Id },
            { email, name, auth0Id },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
    }

    async findByAuth0Id(auth0Id: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ auth0Id });
        return user || undefined;
    }
}
