import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const admin = await this.adminRepository.findOne({ 
      where: { username, isActive: true } 
    });

    if (admin && await admin.validatePassword(password)) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.adminRepository.update(admin.id, { 
      lastLogin: new Date() 
    });

    const payload = { 
      username: admin.username, 
      sub: admin.id, 
      role: admin.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    };
  }

  async register(registerAdminDto: RegisterAdminDto) {
    // Check if admin already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: [
        { username: registerAdminDto.username },
        { email: registerAdminDto.email },
      ],
    });

    if (existingAdmin) {
      throw new UnauthorizedException('Admin with this username or email already exists');
    }

    // Create new admin
    const admin = this.adminRepository.create(registerAdminDto);
    await admin.hashPassword();
    
    const savedAdmin = await this.adminRepository.save(admin);

    const { password, ...result } = savedAdmin;
    return result;
  }

  async findById(id: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { id } });
  }

  async getProfile(userId: string) {
    const admin = await this.adminRepository.findOne({ where: { id: userId } });
    
    if (!admin) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = admin;
    return result;
  }
}
