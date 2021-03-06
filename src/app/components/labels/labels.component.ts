import { Component, OnDestroy, OnInit } from '@angular/core';

import { ResourceModel } from 'ngx-resource-factory/resource/resource-model';

import { Label } from '../../services/resources/label.resource';
import { ActiveFilterService, Filter } from '../../services/navigation/activeFilter.service';
import { AvailableLabelsService } from '../../services/navigation/availableLabels.service';
import { LabelModalComponent } from '../../modals/label-modal/label-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelDeleteModalComponent } from "../../modals/label-delete-modal/label-delete-modal.component";
import { Subscription } from "rxjs/Subscription";


@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit, OnDestroy {

  labels: ResourceModel<Label>[] = [];

  activeFilter: Filter;

  activeFilterSubscription: Subscription;
  availableLabelsSubscription: Subscription;

  constructor(private availableLabelsService: AvailableLabelsService,
              private activeFilterService: ActiveFilterService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.activeFilterSubscription = this.activeFilterService.filterUpdated.subscribe((filter) => {
      this.activeFilter = filter;
    });

    this.availableLabelsSubscription = this.availableLabelsService.labelsUpdated.subscribe((data) => {
      this.labels = data;
    });
  }

  updateActiveFilter(value: number) {
    this.activeFilterService.updateFilter('labels', value);
  }

  addLabel() {
    const modalRef = this.modalService.open(LabelModalComponent, {size: 'sm'});

    modalRef.result.then((result) => {
      this.availableLabelsService.addLabel(result);
    }, (reason) => {
      console.log(`Dismissed: ${reason}`);
    });
  }

  editLabel(label: ResourceModel<Label>) {
    const modalRef = this.modalService.open(LabelModalComponent, {size: 'sm'});
    modalRef.componentInstance.label = label;

    modalRef.result.then((result) => {
      this.availableLabelsService.updateLabel(result);
    }, (reason) => {
      console.log(`Dismissed: ${reason}`);
    });
  }

  deleteLabel(label: ResourceModel<Label>) {
    const modalRef = this.modalService.open(LabelDeleteModalComponent, {size: 'sm'});
    modalRef.componentInstance.label = label;

    modalRef.result.then((result) => {
      this.availableLabelsService.removeLabel(label);
    }, (reason) => {
      console.log(`Dismissed: ${reason}`);
    });
  }

  ngOnDestroy() {
    this.activeFilterSubscription.unsubscribe();
    this.availableLabelsSubscription.unsubscribe();
  }
}
