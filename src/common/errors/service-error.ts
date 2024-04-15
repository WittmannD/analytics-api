import { Type } from '@nestjs/common';
import { Injectable } from '@nestjs/common/interfaces';

export class ServiceError extends Error {
  serviceName?: string;

  constructor(message: string, service?: Type<Injectable>) {
    super(message);
    this.serviceName = service?.name;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}
