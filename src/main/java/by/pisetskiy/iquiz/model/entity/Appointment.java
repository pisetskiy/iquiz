package by.pisetskiy.iquiz.model.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Appointment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    private Quiz quiz;

    @Enumerated(EnumType.STRING)
    private AppointmentState state;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime deadline;
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime startDate;
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime endDate;

}
