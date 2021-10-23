import { Injectable } from '@angular/core';

/**
 * Rather than cookies or storage for a single usage session - no GDPR issues
 */
@Injectable({ providedIn: 'root' })
export class TransientUsageService {
  public onlyMine = false;

  constructor() {}
}
