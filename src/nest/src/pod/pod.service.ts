import { Injectable, NotFoundException } from '@nestjs/common';
import { Pod } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { UploaderService } from '../uploader/uploader.service';
import { CreatePodDto } from './dto/create-pod.dto';
import { UpdatePodDto } from './dto/update-pod.dto';

@Injectable()
export class PodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploaderService: UploaderService,
  ) {}

  async create(createPodDto: CreatePodDto) {
    let image: string | null = null;
    if (createPodDto.image) {
      image = await this.uploaderService.letImageCookToCloud(
        createPodDto.image,
        'pods',
      );
    }
    return this.prisma.pod.create({
      data: {
        pod_name: createPodDto.pod_name,
        description: createPodDto.description,
        image: image,
        type_id: createPodDto.type_id,
        store_id: createPodDto.store_id,
        pod_utilities: {
          create: createPodDto.pod_utilities.map((utility) => ({
            utilities: {
              connect: {
                utility_id: utility.utility_id,
              },
            },
          })),
        },
      },
      include: {
        pod_utilities: true,
        pod_type: true,
      },
    });
  }

  async findAll(): Promise<Pod[]> {
    const pods = await this.prisma.pod.findMany();
    return pods;
  }

  async findOne(id: number) {
    const pod = await this.prisma.pod.findUnique({
      where: {
        pod_id: id,
      },
      include: {
        pod_utilities: {
          include: {
            utilities: true,
          },
        },
      },
    });
    if (!pod) {
      throw new NotFoundException(`Pod with ID ${id} not found`);
    }
    return pod;
  }

  async update(id: number, updatePodDto: UpdatePodDto) {
    const updatedPod = await this.prisma.$transaction(async (prisma) => {
      if (updatePodDto.pod_utilities) {
        await prisma.pod_Utility.deleteMany({
          where: {
            pod_id: id,
          },
        });
      }

      try {
        let image: string | null = null;
        if (updatePodDto.image) {
          image = await this.uploaderService.letImageCookToCloud(
            updatePodDto.image,
            'pods',
          );
        }
        const updatedPod = await prisma.pod.update({
          where: {
            pod_id: id,
          },
          data: {
            pod_name: updatePodDto.pod_name,
            description: updatePodDto.description,
            image: image,
            type_id: updatePodDto.type_id,
            store_id: updatePodDto.store_id,
            pod_utilities: {
              create: updatePodDto.pod_utilities?.map((utility) => ({
                utilities: {
                  connect: {
                    utility_id: utility.utility_id,
                  },
                },
              })),
            },
          },
          include: {
            pod_utilities: true,
            pod_type: true,
          },
        });
        return updatedPod;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(`Pod with ID ${id} not found`);
        }
        throw error;
      }
    });
    return updatedPod;
  }

  async remove(id: number) {
    try {
      await this.prisma.pod.delete({
        where: {
          pod_id: id,
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Pod with ID ${id} not found`);
      }
      throw err;
    }
  }
}
