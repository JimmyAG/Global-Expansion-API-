import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ResearchDocument,
  ResearchDocumentDocument,
} from '@database/mongodb/schemas/research-document.schema';
import { Project } from '@database/mysql/entities';
import { MySQLDataSource } from '@database/mysql/datasource';
import {
  TopVendors,
  VendorAggregateRow,
} from './interfaces/top-vendors.interface';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource(MySQLDataSource) private readonly dataSource: DataSource,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectModel(ResearchDocument.name)
    private readonly researchDocModel: Model<ResearchDocumentDocument>,
  ) {}

  async getTopVendorsPerCountry(): Promise<TopVendors[]> {
    const byCountryMap = new Map<string, VendorAggregateRow[]>();
    const result: TopVendors[] = [];

    const sql = `
      SELECT p.country AS country,
             m.vendor_id AS vendor_id,
             v.name AS vendor_name,
             AVG(m.score) AS avg_score
      FROM matches m
      JOIN projects p ON p.id = m.project_id
      JOIN vendors v ON v.id = m.vendor_id
      WHERE m.created_at >= (NOW() - INTERVAL 30 DAY)
      GROUP BY p.country, m.vendor_id, v.name
      ORDER BY p.country, avg_score DESC;
    `;

    const rawRows: VendorAggregateRow[] = await this.dataSource.query(sql);

    for (const r of rawRows) {
      const arr = byCountryMap.get(r.country) ?? [];
      arr.push(r);
      byCountryMap.set(r.country, arr);
    }

    for (const [country, rows] of byCountryMap.entries()) {
      const topThree = rows.slice(0, 3).map((r) => ({
        vendorId: r.vendor_id,
        name: r.vendor_name,
        avgScore: Number(r.avg_score),
      }));

      const projects = await this.projectRepo.find({
        where: { country },
        select: ['id'],
      });
      const projectIds = projects.map((p) => p.id);

      let researchDocCount = 0;
      if (projectIds.length > 0) {
        researchDocCount = await this.researchDocModel
          .countDocuments({
            projectId: { $in: projectIds },
          })
          .exec();
      }

      result.push({
        country,
        topVendors: topThree,
        researchDocCount,
      });
    }

    return result;
  }
}
